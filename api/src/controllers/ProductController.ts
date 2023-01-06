import { Request, Response } from "express";
import { differenceWith, get, isEqual } from "lodash";
import { Op } from "sequelize";
import { ReqHandler } from "../../types";
import Product from "../models/Product";
import ProductImage from "../models/ProductImage";
import errorResponse from "../utils/errorResponse";
import getPaginationData from "../utils/getPaginationData";
import handleError from "../utils/handleError";
import isDuplicate from "../utils/isDuplicate";
import successResponse from "../utils/successResponse";

export const createProduct: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      categoryId,
      productName,
      product_code,
      product_sku,
      regular_price,
      sale_price,
      tags,
      sizes,
      quantity,
      color,
      gender,
      isFeatured,
      status,
      description,
      productImages,
    } = req.body;

    const product = await Product.findOne({
      where: {
        [Op.or]: [{ productName }, { product_code }, { product_sku }],
      },
    });

    if (product) return errorResponse(res, 403, "Product already exists");

    const { id: productId } = await Product.create({
      categoryId,
      productName,
      product_code,
      product_sku,
      regular_price,
      sale_price,
      tags,
      sizes,
      quantity,
      color,
      gender,
      isFeatured,
      status,
      description,
    });

    await Promise.all(
      productImages.map(async (img: string) => {
        await ProductImage.create({ productId, img });
      })
    );

    successResponse(res, 200, "Product has been created");
  } catch (error) {
    handleError(res, error);
  }
};

export const updateProduct: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "productId");
    const { productName, product_code, product_sku, productImages } = req.body;

    const product = await Product.findByPk(id);

    if (!product) return errorResponse(res, 404, "Product not found");

    const existingProduct = await Product.findOne({
      where: {
        [Op.or]: [{ productName }, { product_code }, { product_sku }],
      },
    });

    if (isDuplicate<Product>(existingProduct, id))
      return errorResponse(res, 403, "Product already exists");

    await Product.update({ ...req.body }, { where: { id } });

    // Update product Images
    const currentProduct_images = await ProductImage.findAll({
      where: {
        productId: id,
      },
      raw: true,
    });

    const existingProductImages: string[] = [];

    currentProduct_images.forEach((p) => existingProductImages.push(p.img));

    const newImages = differenceWith(
      productImages,
      existingProductImages,
      isEqual
    );

    await Promise.all(
      newImages.map(async (img: string) => {
        await ProductImage.create({ productId: Number(id), img });
      })
    );

    const excludeImage = differenceWith(
      existingProductImages,
      productImages,
      isEqual
    );

    await Promise.all(
      excludeImage.map(async (img: string) => {
        await ProductImage.destroy({ where: { img, productId: id } });
      })
    );

    successResponse(res, 202, "Product has been updated");
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteProduct: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "productId");

    const product = await Product.findByPk(id);

    if (!product) return errorResponse(res, 404, "Product not found");

    await Product.destroy({ where: { id } });

    const productImages = await ProductImage.findAll({
      where: { productId: id },
      raw: true,
    });

    await Promise.all(
      productImages.map(async ({ id }) => {
        await ProductImage.destroy({ where: { id } });
      })
    );

    successResponse(res, 202, "Product has been deleted");
  } catch (error) {
    handleError(res, error);
  }
};

export const getProduct: ReqHandler = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "productId");

    const product = await Product.findByPk(id, { raw: true });

    if (!product) return errorResponse(res, 404, "Product not found");

    const productImages = await ProductImage.findAll({
      where: { productId: id },
      raw: true,
    });

    successResponse(res, 200, null, { ...product, productImages });
  } catch (error) {
    handleError(res, error);
  }
};

export const getProducts: ReqHandler = async (req: Request, res: Response) => {
  try {
    const { offset, limit, isPagination } = getPaginationData(req.query);

    if (isPagination) {
      const { rows, count } = await Product.findAndCountAll({
        offset,
        limit,
        order: [["created_at", "DESC"]],
        raw: true,
      });

      successResponse(res, 200, null, { result: rows, count });
    } else {
      const products = await Product.findAll({
        order: [["created_at", "DESC"]],
        raw: true,
      });

      successResponse(res, 200, null, products);
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const getProductByProductName: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const productName = get(req.query, "productName");

    const { offset, limit } = getPaginationData(req.query);

    const { rows, count } = await Product.findAndCountAll({
      offset,
      limit,
      where: {
        productName: {
          [Op.like]: `${productName}%`,
        },
      },
      order: [["created_at", "DESC"]],
      raw: true,
    });

    successResponse(res, 200, null, { result: rows, count });
  } catch (error) {
    handleError(res, error);
  }
};