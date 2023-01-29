import { Request, Response } from "express";
import { get } from "lodash";
import SubscriberCache from "../cache/subscriber.cache";
import Subscriber from "../models/subscriber";
import UserService from "../services/user.service";
import { ReqHandler } from "../types";
import errorResponse from "../utils/errorResponse";
import handleError from "../utils/handleError";
import successResponse from "../utils/successResponse";

export const createSubscribe: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const { userId } = req.user;

    const loggedInUser = await UserService.getUser(+userId);

    if (!loggedInUser) return errorResponse(res, 404, "No logged user");

    const subscriber = await Subscriber.findOne({ where: { email } });

    if (subscriber) return errorResponse(res, 400, "Already subscribed");

    if (email !== loggedInUser.email)
      return errorResponse(res, 403, "Account's email doesn't match!");

    const newSubscriber = await Subscriber.create({ email });

    if (newSubscriber) {
      await SubscriberCache.setSubscriber(newSubscriber);

      successResponse(res, 200, "Subscribed");
    } else errorResponse(res, 200, null);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteSubscribe: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "subscriberId");
    const { userId } = req.user;

    const loggedInUser = await UserService.getUser(+userId);

    if (!loggedInUser) return errorResponse(res, 404, "No logged user");

    const subscriber = await SubscriberCache.getSubscriber(
      +id,
      async () => await Subscriber.findOne({ where: { id } })
    );

    if (!subscriber) return errorResponse(res, 404, "Subscriber not found");

    if (subscriber.email !== loggedInUser.email)
      return errorResponse(res, 403, "Unauthorized");

    await Subscriber.destroy({ where: { id } });

    await SubscriberCache.deleteSubscriber(+id);

    successResponse(res, 200, "Unsubscribed");
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllSubscriber: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const subscribers = await SubscriberCache.restoreSubscriberList();

    successResponse(res, 200, null, subscribers);
  } catch (error) {
    handleError(res, error);
  }
};
