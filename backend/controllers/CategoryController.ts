import { sequelize } from "./../models/index";
import { Request, Response } from "express";
import { get } from "lodash";
import CategoryCache from "../cache/category.cache";
import Category, {
  CategoryWithParentCategory,
  ParentCategoryWithCategories,
} from "../models/category";
import ParentCategory from "../models/parentcategory";
import CategoryService from "../services/category.service";
import { ReqHandler } from "../types";
import errorResponse from "../utils/errorResponse";
import handleError from "../utils/handleError";
import isDuplicate from "../utils/isDuplicate";
import successResponse from "../utils/successResponse";
import Product from "../models/product";

export const createCategory: ReqHandler = async (
  req: Request,
  res: Response
) => {
  const transaction = await sequelize.transaction();
  try {
    const { categoryName, parentCategoryId, description, img } = req.body;

    const category = await Category.findOne({ where: { categoryName } });
    if (category) return errorResponse(res, 403, "Category already exists");

    const parentCategory = await CategoryService.getParentCategory(
      parentCategoryId
    );

    if (!parentCategory)
      return errorResponse(res, 404, "Parent Category not found");

    const newCategory = await Category.create(
      {
        categoryName,
        parentCategoryId,
        description,
        img,
      },
      { transaction }
    );

    if (newCategory) {
      await transaction.commit();
      await CategoryCache.setCategory({
        ...newCategory.get({ plain: true }),
        parentCategoryName: parentCategory.parentCategoryName,
      } as CategoryWithParentCategory);

      successResponse(res, 200, "Category has been created");
    } else errorResponse(res, 500, null);
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export const updateCategory: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "categoryId");

    const { categoryName, parentCategoryId } = req.body;

    const category = await CategoryService.getCategory(+id);
    if (!category) return errorResponse(res, 404, "Category not found");

    const parentCategory = await CategoryService.getParentCategory(
      parentCategoryId
    );

    if (!parentCategory)
      return errorResponse(res, 404, "Parent Category not found");

    const existingCategory = await Category.findOne({
      where: { categoryName },
    });

    if (isDuplicate<Category>(existingCategory, id))
      return errorResponse(res, 403, "Category already exists");

    await Category.update({ ...req.body }, { where: { id } });

    const updatedCategory = await CategoryService.getCategoryQuery(+id);

    await CategoryCache.updateCategory({
      ...updatedCategory,
    } as CategoryWithParentCategory);

    successResponse(res, 200, "Category has been updated");
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

    const category = await CategoryService.getCategory(+id);
    if (!category) return errorResponse(res, 404, "Category not found");

    await Category.destroy({ where: { id } });

    await CategoryCache.deleteCategory(+id);

    successResponse(res, 200, "Category has been deleted");
  } catch (error) {
    handleError(res, error);
  }
};

// not necessary
export const getCategory: ReqHandler = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "categoryId");

    const category = await CategoryService.getCategory(+id);

    if (category !== null) successResponse(res, 200, null, category);
    else errorResponse(res, 404, "Category not found");
  } catch (error) {
    handleError(res, error);
  }
};

export const getCategories: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await CategoryCache.restoreCategoryList();

    await Promise.all(
      categories.map(async (c) => {
        const count = await Product.count({
          where: {
            categoryId: c.id,
          },
        });

        (c as CategoryWithParentCategory)["totalItems"] = count;
      })
    );

    successResponse(res, 200, null, categories);
  } catch (error) {
    handleError(res, error);
  }
};

export const getParentCategories: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const parentCategories = await CategoryCache.restoreParentCategoryList();

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
