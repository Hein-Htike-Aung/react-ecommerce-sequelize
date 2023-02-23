import express from "express";
import user_jwt from "../../../../middlewares/user_jwt";
import { createSubscribe, deleteSubscribe, getAllSubscriber } from "../controller/SubscriberController";

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
    getAllSubscriber
);

export default router;