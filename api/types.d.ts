// import { VerifyErrors } from "jsonwebtoken";
export interface ResponseError extends Error {
  status: number;
}

export interface ResponseObj {
  status: number;
  message: string;
  data?: object;
}

export interface ErrorResponseObj {
  status: number;
  message: string;
  errors?: object;
}
  
export interface TokenBasedRequest extends Request {
  user?: { id: number };
  shop?: { id: number };
  headers: IncomingHttpHeaders;
}

declare module "express" {
  interface Request {
    user: { userId: number };
  }
}

declare module "express-session" {
  export interface SessionData {
    username: string;
    access_token: string;
  }
}

export type TokenVerifyError =
  | JsonWebTokenError
  | NotBeforeError
  | TokenExpiredError;

export type TokenVerifyPayload = JwtPayload | { id: number };

export interface ParsedQs {
  [key: string]: string | number | ParsedQs | string[] | ParsedQs[] | undefined;
}

export type ReqHandler = RequestHandler<ParamsDictionary, ParsedQs>;

export type CountQRes = { count: number }[];
