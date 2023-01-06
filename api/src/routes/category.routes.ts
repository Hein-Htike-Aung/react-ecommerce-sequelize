import express from "express";
import { createCategory, deleteCategory, getCategories, getCategoriesByCategoryName, getCategory, updateCategory } from "../controllers/CategoryController";
import validateRequest from "../middlewares/validate_request";
import { categoryIdParam, categoryNameQueryParam, createCategorySchema, updateCategorySchema } from "../schemas/category.schema";

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
    "/by_categoryName",
    [validateRequest(categoryNameQueryParam)],
    getCategoriesByCategoryName
);

router.get(
    "/list",
    getCategories
);

export default router;