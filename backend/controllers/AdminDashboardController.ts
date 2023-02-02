import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { sequelize } from "../models";
import Orders from "../models/orders";
import Product from "../models/product";
import User from "../models/user";
import AdminDashboardService from "../services/adminDashboard.service";
import { ReqHandler } from "../types";
import { today_date_finder } from "../utils/date";
import handleError from "../utils/handleError";
import successResponse from "../utils/successResponse";

export const dailyEarning: ReqHandler = async (req: Request, res: Response) => {
  try {
    // Daily total earning
    const totalEarning = await AdminDashboardService.getDailyTotalEarning();

    // Daily order
    const dailyOrders = await Orders.count({
      where: {
        order_date: today_date_finder,
      },
    });

    // Sign up users
    const signUpUsers = await User.count({
      where: {
        role: "Customer",
      },
    });

    // total products
    const totalProducts = await Product.count();

    successResponse(res, 200, null, {
      totalEarning,
      dailyOrders,
      signUpUsers,
      totalProducts,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getMonthlySaleReport: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // Monthly sale report
    const monthlySaleReport =
      await AdminDashboardService.getMonthlySaleReport();

    successResponse(res, 200, null, { monthlySaleReport });
  } catch (error) {
    handleError(res, error);
  }
};

export const orderStatusReport: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const q = `select count(o.id) as orderCount, status from orders o group by status`;

    const data = await sequelize.query(q, {
      raw: true,
      type: QueryTypes.SELECT,
    });

    successResponse(res, 200, null, data);
  } catch (error) {
    handleError(res, error);
  }
};

export const weeklyIncomeReport: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await AdminDashboardService.getSevenDays_TotalEarning();

    successResponse(res, 200, null, data);
  } catch (error) {
    handleError(res, error);
  }
};

export const monthlyIncomeReport: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await AdminDashboardService.getThirtyDays_TotalEarning();

    successResponse(res, 200, null, data);
  } catch (error) {
    handleError(res, error);
  }
};

export const yearlyIncomeReport: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await AdminDashboardService.getTotalEarningForMonths();

    successResponse(res, 200, null, data);
  } catch (error) {
    handleError(res, error);
  }
};

