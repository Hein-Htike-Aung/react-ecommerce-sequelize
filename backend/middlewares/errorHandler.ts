import { Request, Response } from "express";
import { ReqHandler, ResponseError } from "../types";

const errorHandler: ReqHandler = (
  err: ResponseError,
  req: Request,
  res: Response
) => {
  return res.status(err.status).json({
    status: err.status,
    message: err.message,
  });
};

export default errorHandler;
