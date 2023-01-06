import { Request, Response } from "express";
import { get } from "lodash";
import { Op } from "sequelize";
import { ReqHandler } from "../../types";
import Category from "../models/Category";
import errorResponse from "../utils/errorResponse";
import getPaginationData from "../utils/getPaginationData";
import handleError from "../utils/handleError";
import isDuplicate from "../utils/isDuplicate";
import successResponse from "../utils/successResponse";

export const createCategory: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryName, parentCategoryId, description, img } = req.body;

    const category = await Category.findOne({ where: { categoryName } });

    if (category) return errorResponse(res, 403, "Category already exists");

    await Category.create({
      categoryName,
      parentCategoryId,
      description,
      img,
    });

    successResponse(res, 200, "Category has been created");
  } catch (error) {
    handleError(res, error);
  }
};

export const updateCategory: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "categoryId");

    const { categoryName } = req.body;

    const category = await Category.findByPk(id);

    if (!category) return errorResponse(res, 404, "Category not found");

    const existingCategory = await Category.findOne({
      where: { categoryName },
    });

    if (isDuplicate<Category>(existingCategory, id))
      return errorResponse(res, 403, "Category already exists");

    await Category.update({ ...req.body }, { where: { id } });

    successResponse(res, 202, "Category has been updated");
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteCategory: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "categoryId");
    const category = await Category.findByPk(id);

    if (!category) return errorResponse(res, 404, "Category not found");

    await Category.destroy({ where: { id } });

    successResponse(res, 202, "Category has been deleted");
  } catch (error) {
    handleError(res, error);
  }
};

export const getCategory: ReqHandler = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "categoryId");

    const category = await Category.findByPk(id);

    if (!category) return errorResponse(res, 404, "Category not found");

    successResponse(res, 200, null, category);
  } catch (error) {
    handleError(res, error);
  }
};

export const getCategories: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { offset, limit, isPagination } = getPaginationData(req.query);

    if (isPagination) {
      const { rows, count } = await Category.findAndCountAll({
        offset,
        limit,
        order: [["created_at", "DESC"]],
        raw: true,
      });
      successResponse(res, 200, null, { result: rows, count });
    } else {
      const categories = await Category.findAll({
        order: [["created_at", "DESC"]],
        raw: true,
      });

      successResponse(res, 200, null, categories);
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const getCategoriesByCategoryName: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryName = get(req.query, "categoryName");

    const { offset, limit } = getPaginationData(req.query);

    const { count, rows } = await Category.findAndCountAll({
      offset,
      limit,
      where: {
        categoryName: {
          [Op.like]: `${categoryName}%`,
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
