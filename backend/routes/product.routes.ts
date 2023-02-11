import { productGenderQueryParam } from './../schemas/product.schema';
import { getProductsByGender, productFilter_1, toggle_isFeatured, productFilter_2 } from './../controllers/ProductController';
import express from "express";
import { createProduct, deleteProduct, getProduct, getProductByProductName, getProducts, updateProduct } from "../controllers/ProductController";
import validateRequest from "../middlewares/validate_request";
import { createProductSchema, productIdParam, productNameQueryParam } from "../schemas/product.schema";

const router = express.Router();

router.post(
    "/create",
    [validateRequest(createProductSchema)],
    createProduct
);

router.patch(
    "/update/:productId",
    [validateRequest(productIdParam)],
    updateProduct
);

router.patch(
    "/update_is_featured/:productId",
    [validateRequest(productIdParam)],
    toggle_isFeatured
);

router.delete(
    "/delete/:productId",
    [validateRequest(productIdParam)],
    deleteProduct
);

router.get(
    "/by_id/:productId",
    [validateRequest(productIdParam)],
    getProduct,
);

router.get(
    "/list",
    getProducts,
);

router.get(
    "/by_productName",
    [validateRequest(productNameQueryParam)],
    getProductByProductName
);

router.get(
    "/by_gender",
    [validateRequest(productGenderQueryParam)],
    getProductsByGender
);

router.get(
    "/filter_1",
    productFilter_1
);

router.get(
    "/filter_2",
    productFilter_2
);

export default router;