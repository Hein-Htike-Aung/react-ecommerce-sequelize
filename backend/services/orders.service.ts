import { likeParam } from "./../utils/likeParam";
import { Op, QueryTypes } from "sequelize";
import { IOrderList } from "../controllers/OrdersController";
import { sequelize } from "../models";
import Orders from "../models/orders";
import { queryParam } from "../types";

class OrdersService {
  static ordersListForAdmin_filter_customer_name_and_order_date = async (
    customer_name: queryParam,
    order_date_from: queryParam,
    order_date_to: queryParam,
    limit: number,
    offset: number
  ) => {
    const q_orders = `select *
                        from orders
                        where customer_name like ? and date(order_date) between ? and ?
                        limit ? offset ?`;

    const orders = await sequelize.query(q_orders, {
      replacements: [
        likeParam(customer_name),
        order_date_from,
        order_date_to,
        limit,
        offset,
      ],
      raw: true,
      type: QueryTypes.SELECT,
    });

    await this.map_order_list(orders);

    const q_count = `select count(id) as count
                        from orders
                        where customer_name like ? and date(order_date) between ? and ?`;

    const [{ count }] = await sequelize.query(q_count, {
      replacements: [likeParam(customer_name), order_date_from, order_date_to],
      raw: true,
      type: QueryTypes.SELECT,
    });

    return { orders, count };
  };

  static orderListForAdmin_filter_customer_name = async (
    customer_name: queryParam,
    limit: number,
    offset: number
  ) => {
    const { rows, count } = await Orders.findAndCountAll({
      limit,
      offset,
      where: {
        customer_name: {
          [Op.like]: likeParam(customer_name),
        },
      },
    });

    await this.map_order_list(rows);

    return { rows, count };
  };

  private static map_order_list = async (orders: Orders[]) => {
    await Promise.all(
      orders.map(async (o: IOrderList | Orders) => {
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
  };
}

export default OrdersService;
