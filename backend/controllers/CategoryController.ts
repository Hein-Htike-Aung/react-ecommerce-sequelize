import { Request, Response } from "express";
import { get } from "lodash";
import { Op, QueryTypes } from "sequelize";
import { ReqHandler } from "../types";
import sequelize from "../models";
import errorResponse from "../utils/errorResponse";
import getPaginationData from "../utils/getPaginationData";
import handleError from "../utils/handleError";
import isDuplicate from "../utils/isDuplicate";
import successResponse from "../utils/successResponse";
import db from "../models";
import Category, { ParentCategoryWithCategories } from "../models/category";
import ParentCategory from "../models/parentcategory";

export const createCategory: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryName, parentCategoryId, description, img } = req.body;

    const category = await Category.findOne({ where: { categoryName } });

    if (category) return errorResponse(res, 403, "Category already exists");

    await db.Category.create({
      categoryName,
      parentCategoryId,
      description,
      img,
    });

    successResponse(res, 201, "Category has been created");
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
      const q = `select c.*, pc.parentCategoryName from category c
                  inner join parent_category pc
                  on c.parentCategoryId = pc.id
                  order by created_at desc
                  limit ? offset ?`;

      const result = await sequelize.query(q, {
        replacements: [limit, offset],
        raw: true,
        type: QueryTypes.SELECT,
      });

      const count = await Category.count();

      successResponse(res, 200, null, { result: result, count });
    } else {
      const q = `select c.*, pc.parentCategoryName from category c
                  inner join parent_category pc
                  on c.parentCategoryId = pc.id
                  order by created_at desc`;

      const categories = await sequelize.query(q, {
        raw: true,
        type: QueryTypes.SELECT,
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

export const getParentCategories: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const parentCategories = await ParentCategory.findAll({
      order: [["created_at", "DESC"]],
      raw: true,
    });

    await Promise.all(
      parentCategories.map(
        async (pc: ParentCategoryWithCategories | ParentCategory) => {
          const categories = await Category.findAll({
            where: {
              parentCategoryId: pc.id,
            },
          });
          (pc as ParentCategoryWithCategories)["categories"] = categories;
        }
      )
    );

    successResponse(res, 200, null, parentCategories);
  } catch (error) {
    handleError(res, error);
  }
};
