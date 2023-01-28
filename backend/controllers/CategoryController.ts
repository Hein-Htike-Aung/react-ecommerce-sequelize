import { Request, Response } from "express";
import { get } from "lodash";
import {
  delete_categoryListCache,
  getCategoryListCache,
  setCategoryCache,
  updateCategoryCache,
} from "../cache/category.cache";
import Category, {
  CategoryWithParentCategory,
  ParentCategoryWithCategories,
} from "../models/category";
import ParentCategory from "../models/parentcategory";
import {
  getAllCategory,
  getCategoryById,
  getCategoryById_using_cache,
  parentCategoryById_using_cache,
} from "../services/category.service";
import { ReqHandler } from "../types";
import errorResponse from "../utils/errorResponse";
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

    const parentCategory = await parentCategoryById_using_cache(
      parentCategoryId
    );
    if (!parentCategory)
      return errorResponse(res, 404, "Parent Category not found");

    const newCategory = await Category.create({
      categoryName,
      parentCategoryId,
      description,
      img,
    });

    if (newCategory) {
      await setCategoryCache({
        ...newCategory.get({ plain: true }),
        parentCategoryName: parentCategory.parentCategoryName,
      } as CategoryWithParentCategory);

      successResponse(res, 200, "Category has been created");
    } else errorResponse(res, 500, null);
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

    const { categoryName, parentCategoryId } = req.body;

    const category = await getCategoryById_using_cache(+id);
    if (!category) return errorResponse(res, 404, "Category not found");

    const parentCategory = await parentCategoryById_using_cache(
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

    const updatedCategory = await getCategoryById(+id);

    await updateCategoryCache({
      ...updatedCategory,
    } as CategoryWithParentCategory);

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

    const category = await getCategoryById_using_cache(+id);
    if (!category) return errorResponse(res, 404, "Category not found");

    await Category.destroy({ where: { id } });

    await delete_categoryListCache(+id);

    successResponse(res, 202, "Category has been deleted");
  } catch (error) {
    handleError(res, error);
  }
};

// not necessary
export const getCategory: ReqHandler = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "categoryId");

    const category = await getCategoryById_using_cache(+id);

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
    const categories = await getCategoryListCache(async () => getAllCategory());

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
