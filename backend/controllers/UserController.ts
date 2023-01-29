import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import errorResponse from "../utils/errorResponse";
import successResponse from "../utils/successResponse";
import { get, omit } from "lodash";
import { ReqHandler } from "../types";
import handleError from "../utils/handleError";
import User from "../models/user";
import UserCache from "../cache/user.cache";
import UserService from "../services/user.service";

export const createUser: ReqHandler = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phone, gender, role } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (user) return errorResponse(res, 403, "User already exists");

    const salt = await bcrypt.genSalt(
      process.env.SALT ? +process.env.SALT : 10
    );
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      gender,
      role,
    });

    await UserCache.setUser(newUser);

    successResponse(res, 201, "User has been created");
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser: ReqHandler = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "userId");

    const user = await UserService.getUser(+id);

    if (!user) return errorResponse(res, 404, "User not found");

    await User.update({ ...req.body }, { where: { id } });

    const updatedUser = await User.findByPk(id);

    if (!updatedUser) return errorResponse(res, 404, "User not found");

    await UserCache.updateUser(updatedUser);

    successResponse(res, 201, "Account has been updated");
  } catch (error) {
    handleError(res, error);
  }
};

export const getUsers: ReqHandler = async (req: Request, res: Response) => {
  try {
    const users = await UserCache.restoreUserList();

    successResponse(
      res,
      200,
      null,
      users.map((user) => omit(user, "password"))
    );
  } catch (error) {
    handleError(res, error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "userId");

    const user = await UserService.getUser(+id);

    if (!user) return errorResponse(res, 404, "User not found");

    successResponse(res, 200, null, omit(user, "password"));
  } catch (error) {
    handleError(res, error);
  }
};

export const toggleUserStatus: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "userId");
    const { status } = req.body;

    const user = await UserService.getUser(+id);

    if (!user) return errorResponse(res, 404, "User not found");

    await User.update({ status }, { where: { id } });

    successResponse(
      res,
      200,
      `User has been ${status ? "Inactive" : "Active"}`
    );

    const updatedUser = await User.findByPk(id);

    if (!updatedUser) return errorResponse(res, 404, "User not found");

    await UserCache.updateUser(updatedUser);
  } catch (error) {
    handleError(res, error);
  }
};

// export const getUsersByName: ReqHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const fullName = get(req.query, "fullName");

//     const { offset, limit } = getPaginationData(req.query);

//     const { count, rows } = await User.findAndCountAll({
//       offset,
//       limit,
//       attributes: { exclude: ["password"] },
//       where: {
//         fullName: {
//           [Op.like]: `${fullName}%`,
//         },
//       },
//       order: [["created_at", "DESC"]],
//       raw: true,
//     });

//     successResponse(res, 200, null, { result: rows, count });
//   } catch (error) {
//     handleError(res, error);
//   }
// };
