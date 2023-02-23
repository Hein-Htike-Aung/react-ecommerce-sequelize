import { Request, Response } from "express";
import { get } from "lodash";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../../../models";
import OrderItem from "../../../../models/orderitem";
import Orders from "../../../../models/orders";
import Product from "../../../../models/product";
import ProductImage from "../../../../models/productimage";
import User from "../../../../models/user";
import OrdersService from "../services/orders.service";
import UserService from "../../users/services/user.service";
import { ReqHandler } from "../../../../../types";
import { formattedCurrentDate } from "../../../../utils/date";
import errorResponse from "../../../../utils/errorResponse";
import getPaginationData from "../../../../utils/getPaginationData";
import handleError from "../../../../utils/handleError";
import successResponse from "../../../../utils/successResponse";

interface IOrderItem {
  productId: number;
  quantity: number;
}

interface IOrderItemWithProductImages extends OrderItem {
  productImages: ProductImage[];
}

export interface IOrderList extends Orders {
  orderDetails: {
    itemPrice: number;
    totalQuantity: number;
    product: Product;
  };
}

export const createOrder: ReqHandler = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const { shipping_address, paymentMethod, orderItems } = req.body;

    const { userId } = req.user;

    const user = await User.findByPk(userId);

    if (!user) return errorResponse(res, 403, "Unauthorized");

    const { id: orderId } = await Orders.create(
      {
        orderId: uuidv4(),
        shipping_address,
        paymentMethod,
        order_date: formattedCurrentDate,
        shipping_fee: 0.5,
        userId,
      },
      { transaction }
    );

    await Promise.all(
      orderItems.map(async (item: IOrderItem) => {
        await OrderItem.create(
          {
            orderId,
            productId: item.productId,
            quantity: item.quantity,
          },
          { transaction }
        );
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
          { where: { id: item.productId }, transaction }
        );
      })
    );

    await transaction.commit();
    successResponse(res, 200, null, "Order has been placed");
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export const updateOrderStatus: ReqHandler = async (
  req: Request,
  res: Response
) => {
  const transaction = await sequelize.transaction();
  try {
    const orderId = get(req.params, "orderId");
    const { status } = req.body;

    const orders = await Orders.findByPk(orderId);

    if (!orders) return errorResponse(res, 404, "Order not found");

    await Orders.update(
      {
        status,
      },
      {
        where: {
          id: orderId,
        },
        transaction,
      }
    );

    await transaction.commit();
    successResponse(res, 200, "Order status has been updated");
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export const getOrder: ReqHandler = async (req: Request, res: Response) => {
  try {
    const orderId = get(req.params, "orderId");

    const orders = await Orders.findByPk(orderId);

    if (!orders) return errorResponse(res, 404, "Order not found");

    const q_order_items = `select oi.*, p.productName, c.categoryName
                            from order_item oi
                            inner join orders o
                            on o.id = oi.orderId 
                            inner join product p
                            on p.id = oi.productId
                            inner join category c
                            on c.id = p.categoryId
                            where o.id = ?`;

    const orderItems = await sequelize.query(q_order_items, {
      replacements: [orderId],
      raw: true,
      type: QueryTypes.SELECT,
    });

    await Promise.all(
      orderItems.map(async (oi: OrderItem | IOrderItemWithProductImages) => {
        const productImages = await ProductImage.findAll({
          where: { productId: oi.productId },
          raw: true,
        });
        (oi as IOrderItemWithProductImages)["productImages"] = productImages;
      })
    );

    successResponse(res, 200, null, { orders, orderItems });
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

    await OrdersService.map_order_list(rows);

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

export const orderListForCustomer: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { offset, limit } = getPaginationData(req.query);
    const { userId } = req.user;

    const user = await UserService.getUser(+userId);

    if (!user) return errorResponse(res, 403, "Unauthorized");

    const { rows, count } = await Orders.findAndCountAll({
      offset,
      limit,
      raw: true,
      where: {
        userId,
      },
    });

    successResponse(res, 200, null, { result: rows, count });
  } catch (error) {
    handleError(res, error);
  }
};

export const orderDetailsForCustomer: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = get(req.params, "userId");

    const user = await UserService.getUser(+userId);

    const order = await Orders.findOne({ where: { userId } });

    if (!order)
      return successResponse(res, 200, "No order found with this user");

    const q = `select p.*, sum(p.sale_price * oi.quantity) as itemPrice, sum(oi.quantity) as totalQuantity 
                    from order_item oi
                    inner join product p
                    on p.id = oi.productId
                    where oi.orderId = ?
                    group by oi.orderId`;

    const orderDetails = await sequelize.query(q, {
      replacements: [order.id],
      raw: true,
      type: QueryTypes.SELECT,
    });

    (order as IOrderList)["orderDetails"] = orderDetails;

    successResponse(res, 200, null, {
      user,
      order,
    });
  } catch (error) {
    handleError(res, error);
  }
};
