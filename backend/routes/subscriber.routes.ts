import express from "express";
import { createSubscribe, deleteSubscribe, getAllSubscriber } from "../controllers/SubscriberController";
import jwt_auth from "../middlewares/jwt_auth";
import validateRequest from "../middlewares/validate_request";
import { paginationQuery } from "../schemas/common.schema";

const router = express.Router();

router.post(
    "/subscribe",
    [jwt_auth],
    createSubscribe
);

router.post(
    "/unsubscribe/:subscriberId",
    [jwt_auth],
    deleteSubscribe
);

router.get(
    "/list",
    [validateRequest(paginationQuery)],
    getAllSubscriber
);

export default router;