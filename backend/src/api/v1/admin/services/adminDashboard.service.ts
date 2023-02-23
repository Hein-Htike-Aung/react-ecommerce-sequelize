import { QueryTypes } from "sequelize";
import { sequelize } from "../../../../models";
import Orders from "../../../../models/orders";
import { formatDate, getDaysInMonth } from "../../../../utils/date";
import today_date_finder from "../../../../utils/today_date_finder";

class AdminDashboardService {
  /*  */
  static getDailyTotalEarning = async () => {
    const orders = await Orders.findAll({
      where: {
        order_date: today_date_finder,
      },
    });

    const totalEarning = await this.getTotalEarningForOrders(orders);

    return totalEarning;
  };

  /* Total Earning for seven days */
  static getSevenDays_TotalEarning = async () => {
    const pastSevenDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      pastSevenDays.push(formatDate(d));
    }

    return await this.getTotalEarningForDays(pastSevenDays);
  };

  /* Total Earning for current Month */
  static getThirtyDays_TotalEarning = async () => {
    const now = new Date();
    const pastThirtyDays = getDaysInMonth(now.getMonth(), now.getFullYear());

    return await this.getTotalEarningForDays(pastThirtyDays);
  };

  /* Total Earning by days */
  static getTotalEarningForDays = async (days: string[]) => {
    const earningByDays: { day: string; totalEarning: number }[] = [];

    for (const d of days) {
      const q = `select * from orders
      where date(order_date) = ?`;

      const orders = await sequelize.query(q, {
        replacements: [d],
        raw: true,
        type: QueryTypes.SELECT,
      });

      const totalEarning = await this.getTotalEarningForOrders(orders);

      earningByDays.push({ day: d, totalEarning });
    }

    return earningByDays;
  };

  /* Total Earning by months */
  static getTotalEarningForMonths = async () => {
    const earningByDays: { month: number; totalEarning: number }[] = [];

    for (let i = 1; i <= 12; i++) {
      const q = `select * from orders
      where month(order_date) = ?`;

      const orders = await sequelize.query(q, {
        replacements: [i],
        raw: true,
        type: QueryTypes.SELECT,
      });

      const totalEarning = await this.getTotalEarningForOrders(orders);

      earningByDays.push({ month: i, totalEarning });
    }

    return earningByDays;
  };

  /*  */
  static getMonthlySaleReport = async () => {
    const monthlySaleReport = [];

    for (let i = 1; i <= 12; i++) {
      const q = `select count(id) as order_count from orders where month(order_date) = ?`;

      const [{ order_count }] = await sequelize.query(q, {
        replacements: [i],
        raw: true,
        type: QueryTypes.SELECT,
      });

      monthlySaleReport.push({
        month: i,
        order_count,
      });
    }

    return monthlySaleReport;
  };

  /*  */
  static getTotalEarningForOrders = async (orders: Orders[]) => {
    let totalEarning = 0;

    await Promise.all(
      orders.map(async (o) => {
        const q = `select sum(p.sale_price * oi.quantity) as total from order_item oi
                          inner join product p
                          on p.id = oi.productId
                          where oi.orderId = ?`;

        const [{ total }] = await sequelize.query(q, {
          replacements: [o.id],
          raw: true,
          type: QueryTypes.SELECT,
        });

        totalEarning += Number(total);
      })
    );

    return totalEarning;
  };
}

export default AdminDashboardService;
