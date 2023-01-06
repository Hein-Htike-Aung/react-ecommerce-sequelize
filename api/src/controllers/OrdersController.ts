import { Request, Response } from "express";
import Orders from "../models/Orders";
import { v4 as uuidv4 } from "uuid";
import handleError from "../utils/handleError";
import { formattedCurrentDate } from "../utils/date";
import OrderItem from "../models/OrderItem";
import successResponse from "../utils/successResponse";
import Product from "../models/Product";
import errorResponse from "../utils/errorResponse";
import getPaginationData from "../utils/getPaginationData";

interface IOrderItem {
  productId: number;
  quantity: number;
}

export const createOrder = async (req: Request, res: Response) => {
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

export const ordersList = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = getPaginationData(req.query);

    
  } catch (error) {
    handleError(res, error);
  }
}