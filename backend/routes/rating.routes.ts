import express from "express";
import { createRating, getRatingForProduct } from "../controllers/RatingController";
import jwt_auth from "../middlewares/jwt_auth";
import validateRequest from "../middlewares/validate_request";
import { productIdParam } from "../schemas/product.schema";
import { createRatingSchema } from "../schemas/rating.schema";

const router = express.Router();

router.post(
    "/rate_product",
    [validateRequest(createRatingSchema) , jwt_auth],
    createRating
);

router.get(
    "/get_rate/:productId",
    [validateRequest(productIdParam)],
    getRatingForProduct
)

export default router;