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
import { sequelize } from "../models";

export const createUser: ReqHandler = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
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

    const newUser = await User.create(
      {
        fullName,
        email,
        password: hashedPassword,
        phone,
        gender,
        role,
      },
      { transaction }
    );

    await transaction.commit();
    await UserCache.setUser(newUser);

    successResponse(res, 201, "User has been created");
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export const updateUser: ReqHandler = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.user;

    const user = await UserService.getUser(+userId);

    if (!user) return errorResponse(res, 404, "User not found");

    // Name, phone, gender, about, img
    await User.update({ ...req.body }, { where: { id: userId }, transaction });

    const updatedUser = await User.findByPk(userId);

    if (!updatedUser) return errorResponse(res, 404, "User not found");

    await transaction.commit();
    await UserCache.updateUser(updatedUser);

    successResponse(res, 200, "Account has been updated");
  } catch (error) {
    transaction.rollback();
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
  const transaction = await sequelize.transaction();
  try {
    const id = get(req.params, "userId");
    const { status } = req.body;

    const user = await UserService.getUser(+id);

    if (!user) return errorResponse(res, 404, "User not found");

    await User.update({ status }, { where: { id }, transaction });

    successResponse(
      res,
      200,
      `User has been ${status ? "Inactive" : "Active"}`
    );

    const updatedUser = await User.findByPk(id);

    if (!updatedUser) return errorResponse(res, 404, "User not found");

    await transaction.commit();
    await UserCache.updateUser(updatedUser);
  } catch (error) {
    await transaction.rollback();
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
