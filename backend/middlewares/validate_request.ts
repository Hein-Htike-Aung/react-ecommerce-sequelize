import { AnySchema, ValidationError } from "yup";
import { Request, Response, NextFunction } from "express";
import errorResponse from "../utils/errorResponse";
import logger from "../utils/logger";
import { ReqHandler } from "../types";

const validateRequest: ReqHandler =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        {
          strict: true,
        }
      );

      return next();
    } catch (error) {
      if (error instanceof ValidationError)
        return errorResponse(res, 400, "Bad Request", error.errors);
      else logger.error(error);
    }
  };

export default validateRequest;
