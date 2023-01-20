import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import errorResponse from "../utils/errorResponse";
import successResponse from "../utils/successResponse";
import { ReqHandler } from "../types";
import { omit } from "lodash";
import handleError from "../utils/handleError";
import User from "../models/user";

export const userLogin: ReqHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      raw: true,
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return errorResponse(res, 401, "Invalid Username or password");
    }

    const access_token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET
        ? process.env.ACCESS_TOKEN_SECRET
        : "Secret",
      {
        algorithm: "HS256",
        expiresIn: "6h",
      }
    );

    successResponse(res, 200, "Successfully login", {
      access_token,
      ...omit(user, "password"),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const changeUserPassword: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (oldPassword === newPassword)
      return errorResponse(
        res,
        400,
        "Old password and new password can not be the same"
      );

    const { userId } = req.user;

    const user = await User.findByPk(userId, { raw: true });

    if (!user) return errorResponse(res, 404, "User not found");

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return errorResponse(res, 403, "Unauthorized");
    }

    const salt = await bcrypt.genSalt(
      process.env.SALT ? +process.env.SALT : 10
    );
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await User.update({ password: hashedPassword }, { where: { id: userId } });

    successResponse(res, 202, "Password has been updated");
  } catch (error) {
    handleError(res, error);
  }
};
