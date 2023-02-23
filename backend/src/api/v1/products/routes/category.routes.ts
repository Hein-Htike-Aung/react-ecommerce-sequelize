import { getParentCategories } from '../controller/CategoryController';
import express from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controller/CategoryController";
import { categoryIdParam, createCategorySchema, updateCategorySchema } from "../schemas/category.schema";
import validateRequest from '../../../../middlewares/validate_request';

const router = express.Router();

router.post(
    "/create",
    [validateRequest(createCategorySchema)],
    createCategory
);

router.patch(
    "/update/:categoryId",
    [validateRequest(updateCategorySchema)],
    updateCategory
);

router.delete(
    "/delete/:categoryId",
    [validateRequest(categoryIdParam)],
    deleteCategory
);

router.get(
    "/by_id/:categoryId",
    [validateRequest(categoryIdParam)],
    getCategory
);

router.get(
    "/list",
    getCategories
);

router.get(
    "/parent_category_list",
    getParentCategories 
);

export default router;