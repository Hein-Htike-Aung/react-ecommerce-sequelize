import express from "express";
import { createOrder, getOrder, ordersListForAdmin, ordersListForAdmin_filter, updateOrderStatus } from "../controllers/OrdersController";
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
);

router.get(
    "/by_id/:orderId",
    getOrder
);

router.patch(
    "/update_order_status/:orderId", 
    updateOrderStatus
);

export default router;
