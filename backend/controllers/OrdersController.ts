import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../models";
import OrderItem from "../models/orderitem";
import Orders from "../models/orders";
import Product from "../models/product";
import OrdersService from "../services/orders.service";
import { ReqHandler } from "../types";
import { formattedCurrentDate } from "../utils/date";
import errorResponse from "../utils/errorResponse";
import getPaginationData from "../utils/getPaginationData";
import handleError from "../utils/handleError";
import successResponse from "../utils/successResponse";

interface IOrderItem {
  productId: number;
  quantity: number;
}

export interface IOrderList extends Orders {
  price: number;
  totalQuantity: number;
}

export const createOrder: ReqHandler = async (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      paymentMethod,
      orderItems,
    } = req.body;

    const { id: orderId } = await Orders.create({
      orderId: uuidv4(),
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      paymentMethod,
      order_date: formattedCurrentDate,
      shipping_fee: 0.5,
    });

    await Promise.all(
      orderItems.map(async (item: IOrderItem) => {
        await OrderItem.create({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
        });
      })
    );

    await Promise.all(
      orderItems.map(async (item: IOrderItem) => {
        const existingProduct = await Product.findByPk(item.productId, {
          raw: true,
        });

        if (!existingProduct) return errorResponse(res, 500, null);

        await Product.update(
          { quantity: existingProduct.quantity - item.quantity },
          { where: { id: item.productId } }
        );
      })
    );

    successResponse(res, 200, null, "Order has been placed");
  } catch (error) {
    handleError(res, error);
  }
};

export const ordersListForAdmin: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { offset, limit } = getPaginationData(req.query);

    const { rows, count } = await Orders.findAndCountAll({
      offset,
      limit,
      raw: true,
    });

    await Promise.all(
      rows.map(async (o: IOrderList | Orders) => {
        const q = `select sum(p.sale_price * oi.quantity) as itemPrice, sum(oi.quantity) as totalQuantity 
                from order_item oi
                inner join product p
                on p.id = oi.productId
                where oi.orderId = ?
                group by oi.orderId`;

        const [{ itemPrice, totalQuantity }] = await sequelize.query(q, {
          replacements: [o.id],
          raw: true,
          type: QueryTypes.SELECT,
        });

        (o as IOrderList)["price"] = itemPrice;
        (o as IOrderList)["totalQuantity"] = totalQuantity;
      })
    );

    successResponse(res, 200, null, { result: rows, count });
  } catch (error) {
    handleError(res, error);
  }
};

export const ordersListForAdmin_filter: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { offset, limit } = getPaginationData(req.query);
    const { customer_name, order_date_from, order_date_to } = req.query;

    if (order_date_from && order_date_to) {
      const data =
        await OrdersService.ordersListForAdmin_filter_customer_name_and_order_date(
          customer_name,
          order_date_from,
          order_date_to,
          limit,
          offset
        );

      successResponse(res, 200, null, data);
    } else {
      const data = await OrdersService.orderListForAdmin_filter_customer_name(
        customer_name,
        limit,
        offset
      );

      successResponse(res, 200, null, data);
    }
  } catch (error) {
    handleError(res, error);
  }
};
