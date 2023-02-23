import { Response } from "express";
import { ValidationError } from "sequelize";

const handleError = (res: Response, errors: unknown) => {
  res.status(500).json({
    status: 500,
    message: "Something went wrong",
    errors
      // typeof errors === "object"
      //   ? (errors as ValidationError).errors.map((error) => ({
      //       message: error.message,
      //       type: error.type,
      //     }))
      //   : undefined,
  });
};

export default handleError;
