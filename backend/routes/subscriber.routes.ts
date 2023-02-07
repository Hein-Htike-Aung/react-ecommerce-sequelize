import express from "express";
import { createSubscribe, deleteSubscribe, getAllSubscriber } from "../controllers/SubscriberController";
import user_jwt from "../middlewares/user_jwt";
import validateRequest from "../middlewares/validate_request";
import { paginationQuery } from "../schemas/common.schema";

const router = express.Router();

router.post(
    "/subscribe",
    [user_jwt],
    createSubscribe
);

router.post(
    "/unsubscribe/:subscriberId",
    [user_jwt],
    deleteSubscribe
);

router.get(
    "/list",
    [validateRequest(paginationQuery)],
    getAllSubscriber
);

export default router;