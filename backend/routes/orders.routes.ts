import express from "express";
import { createOrder, ordersListForAdmin, ordersListForAdmin_filter } from "../controllers/OrdersController";
import validateRequest from "../middlewares/validate_request";
import { paginationQuery } from "../schemas/common.schema";
import { placeOrderSchema } from "../schemas/orders.schema";

const router = express.Router();

router.post(
    "/place_order",
    [validateRequest(placeOrderSchema)],
    createOrder
);

router.get(
    "/for_admin",
    [validateRequest(paginationQuery)],
    ordersListForAdmin
);

router.get(
    "/for_admin_filter",
    ordersListForAdmin_filter
)

export default router;
