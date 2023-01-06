import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import errorResponse from "../utils/errorResponse";
import successResponse from "../utils/successResponse";
import { get } from "lodash";
import getPaginationData from "../utils/getPaginationData";
import { ReqHandler } from "../../types";
import { Op } from "sequelize";
import handleError from "../utils/handleError";

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

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      gender,
      role,
    });

    successResponse(res, 200, "User has been created");
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser: ReqHandler = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "userId");

    const user = await User.findByPk(id);

    if (!user) return errorResponse(res, 404, "User not found");

    await User.update({ ...req.body }, { where: { id } });

    successResponse(res, 201, "Account has been updated");
  } catch (error) {
    handleError(res, error);
  }
};

export const getUsers: ReqHandler = async (req: Request, res: Response) => {
  try {
    const { offset, limit, isPagination } = getPaginationData(req.query);

    if (isPagination) {
      const { rows, count } = await User.findAndCountAll({
        offset,
        limit,
        attributes: { exclude: ["password"] },
        order: [["created_at", "DESC"]],
        raw: true,
      });

      successResponse(res, 200, null, { result: rows, count });
    } else {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
        order: [["created_at", "DESC"]],
        raw: true,
      });

      successResponse(res, 200, null, users);
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "userId");

    const user = await User.findByPk(id);

    if (!user) return errorResponse(res, 404, "User not found");

    successResponse(res, 200, null, user);
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

    const user = await User.findByPk(id);

    if (!user) return errorResponse(res, 404, "User not found");

    await User.update({ status: !user.status }, { where: { id } });

    successResponse(
      res,
      200,
      `User has been ${user.status ? "Inactive" : "Active"}`
    );
  } catch (error) {
    handleError(res, error);
  }
};

export const getUsersByName: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const fullName = get(req.query, "fullName");

    const { offset, limit } = getPaginationData(req.query);

    const { count, rows } = await User.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ["password"] },
      where: {
        fullName: {
          [Op.like]: `${fullName}%`,
        },
      },
      order: [["created_at", "DESC"]],
      raw: true,
    });

    successResponse(res, 200, null, { result: rows, count });
  } catch (error) {
    handleError(res, error);
  }
};
