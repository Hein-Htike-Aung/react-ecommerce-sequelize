import express from "express";
import { createOrder, getOrder, orderDetailsForCustomer, orderListForCustomer, ordersListForAdmin, ordersListForAdmin_filter, updateOrderStatus } from "../controller/OrdersController";
import { paginationQuery } from "../../../../utils/common.schema";
import { placeOrderSchema } from "../schemas/orders.schema";
import validateRequest from "../../../../middlewares/validate_request";
import user_jwt from "../../../../middlewares/user_jwt";

const router = express.Router();

router.post(
    "/place_order",
    [validateRequest(placeOrderSchema), user_jwt],
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
    "/for_customer",
    user_jwt,
    orderListForCustomer
);

router.get(
    "/details_for_customer/:userId",
    // user_jwt,
    orderDetailsForCustomer
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
