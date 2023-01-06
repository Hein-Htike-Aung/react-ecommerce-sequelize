import { Response } from "express";
import cleanObj from "./cleanObj";

const successResponse = (
  res: Response,
  status: number,
  message: string | null,
  data = {}
) => {
  res.status(status).json(
    cleanObj({
      status: status || 200,
      message: message || "Retrieved successful",
      data,
    })
  );
};

export default successResponse;
