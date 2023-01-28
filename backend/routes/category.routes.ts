import { getParentCategories } from './../controllers/CategoryController';
import express from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/CategoryController";
import validateRequest from "../middlewares/validate_request";
import { categoryIdParam, createCategorySchema, updateCategorySchema } from "../schemas/category.schema";

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