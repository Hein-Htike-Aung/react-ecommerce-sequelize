import express from "express";
import { createRating, getRatingForProduct } from "../controller/RatingController";
import { productIdParam } from "../schemas/product.schema";
import { createRatingSchema } from "../schemas/rating.schema";
import user_jwt from "../../../../middlewares/user_jwt";
import validateRequest from "../../../../middlewares/validate_request";

const router = express.Router();

router.post(
    "/rate_product",
    [validateRequest(createRatingSchema) , user_jwt],
    createRating
);

router.get(
    "/get_rate/:productId",
    [validateRequest(productIdParam)],
    getRatingForProduct
)

export default router;