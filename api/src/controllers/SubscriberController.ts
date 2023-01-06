import { Request, Response } from "express";
import { ReqHandler } from "../../types";
import Subscriber from "../models/Subscriber";
import getPaginationData from "../utils/getPaginationData";
import handleError from "../utils/handleError";
import successResponse from "../utils/successResponse";

export const createSubscribe: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.user;

    await Subscriber.create({ userId });

    successResponse(res, 200, "Subscribed");
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteSubscribe: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.user;

    await Subscriber.destroy({ where: { userId } });

    successResponse(res, 200, "Subscribed");
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllSubscriber: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { offset, limit } = getPaginationData(req.query);

    const { rows, count } = await Subscriber.findAndCountAll({
      offset,
      limit,
      order: [["created_at", "DESC"]],
      raw: true,
    });

    successResponse(res, 200, null, { result: rows, count });
  } catch (error) {
    handleError(res, error);
  }
};
