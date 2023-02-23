import { Response } from "express";
import cleanObj from "./cleanObj";

const errorResponse = (
  res: Response,
  status: number,
  message: string | null,
  errors = {}
) => {
  res.status(status).json(
    cleanObj({
      status: status || 200,
      message: message || "Something went wrong",
      errors,
    })
  );
};

export default errorResponse;
