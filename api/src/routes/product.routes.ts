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

export default router;