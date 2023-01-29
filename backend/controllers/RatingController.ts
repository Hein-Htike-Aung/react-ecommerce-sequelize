import { QueryTypes } from "sequelize";
import { Request, Response } from "express";
import { get } from "lodash";
import { sequelize } from "../models";
import Rating from "../models/rating";
import ProductService from "../services/product.service";
import { ReqHandler } from "../types";
import errorResponse from "../utils/errorResponse";
import handleError from "../utils/handleError";
import successResponse from "../utils/successResponse";

export const createRating: ReqHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { productId, rating } = req.body;

    const existingProduct = await ProductService.getProduct(+productId);

    if (!existingProduct) return errorResponse(res, 404, "Product not found");

    const existingRating = await Rating.findOne({
      where: { productId, userId },
    });

    if (existingRating)
      return errorResponse(res, 403, "Already rated this product");

    await Rating.create({ productId, rating, userId });

    successResponse(res, 200, "Rate has been set");
  } catch (error) {
    handleError(res, error);
  }
};

export const getRatingForProduct: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = get(req.params, "productId");

    const q = `select avg(r.rating) as rate from rating r where r.productId = ?`;

    const [avg] = await sequelize.query(q, {
      replacements: [productId],
      type: QueryTypes.SELECT,
    });

    successResponse(res, 200, null, avg);
  } catch (error) {
    handleError(res, error);
  }
};
