import { ResponseError } from "../../types";

const createError = (status: number, message = "Something went wrong") => {
  const error = new Error() as ResponseError;
  error.status = status || 500;
  error.message = message;

  return error;
};

export default createError;
