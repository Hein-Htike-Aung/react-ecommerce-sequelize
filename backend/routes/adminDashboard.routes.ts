import express from "express";
import { dailyEarning, getMonthlySaleReport, monthlyIncomeReport, orderStatusReport, weeklyIncomeReport, yearlyIncomeReport } from "../controllers/AdminDashboardController";


const router = express.Router();

router.get(
    "/daily_total_earning",
    dailyEarning
);

router.get(
    "/monthly_sale_report",
    getMonthlySaleReport
);

router.get(
    "/order_status_report",
    orderStatusReport
);

router.get(
    "/weekly_income_report",
    weeklyIncomeReport
);

router.get(
    "/monthly_income_report",
    monthlyIncomeReport
);

router.get(
    "/yearly_income_report",
    yearlyIncomeReport
);

export default router;
