
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ReqHandler, TokenBasedRequest, TokenVerifyError, TokenVerifyPayload } from "../../types";
import errorResponse from "../utils/errorResponse";

const user_jwt: ReqHandler = (
  req: TokenBasedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return errorResponse(res, 403, "Unauthorized");

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET
      ? process.env.ACCESS_TOKEN_SECRET
      : "Secret",
    (err: TokenVerifyError, user: TokenVerifyPayload) => {
      if (err) return errorResponse(res, 403, err.message);
      req.user = user;
      next();
    }
  );
};

export default user_jwt;
