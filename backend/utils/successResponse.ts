import { Response } from "express";

const successResponse = (
  res: Response,
  status: number,
  message: string | null,
  data = {}
) => {
  res.status(status).json({
    status: status || 200,
    message: message || "Retrieved successful",
    data,
  });
};

export default successResponse;
