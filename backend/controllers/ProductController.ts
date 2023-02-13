import { likeParam } from "./../utils/likeParam";
import { Request, Response } from "express";
import { differenceWith, get, isEqual } from "lodash";
import { Op, QueryTypes } from "sequelize";
import ProductCache from "../cache/product.cache";
import { sequelize } from "../models";
import Product, { ProductWithImages, ProductWithRate } from "../models/product";
import ProductImage from "../models/productimage";
import ProductService from "../services/product.service";
import { ReqHandler } from "../types";
import errorResponse from "../utils/errorResponse";
import getPaginationData from "../utils/getPaginationData";
import handleError from "../utils/handleError";
import isDuplicate from "../utils/isDuplicate";
import successResponse from "../utils/successResponse";
import RatingService from "../services/rating.service";

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
      colors,
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
      colors,
      gender,
      isFeatured,
      status,
      description,
    });

    await Promise.all(
      productImages?.map(async (img: string) => {
        await ProductImage.create({ productId, img });
      })
    );

    successResponse(res, 201, "Product has been created");
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

    const product = await ProductService.getProduct(+id);

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

    // update product cache
    const updatedProduct = await Product.findByPk(id);

    if (!updatedProduct) return errorResponse(res, 404, "Product not found");

    await ProductCache.updateProduct(updatedProduct);

    successResponse(res, 202, "Product has been updated");
  } catch (error) {
    handleError(res, error);
  }
};

export const toggle_isFeatured: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "productId");
    const { isFeatured } = req.body;

    const product = await ProductService.getProduct(+id);

    if (!product) return errorResponse(res, 404, "Product not found");

    await Product.update(
      {
        isFeatured,
      },
      {
        where: {
          id,
        },
      }
    );

    // update product cache
    const updatedProduct = await Product.findByPk(id);

    if (!updatedProduct) return errorResponse(res, 404, "Product not found");

    await ProductCache.updateProduct(updatedProduct);

    successResponse(res, 202, "Product is_featured status has been updated");
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

    const product = await ProductService.getProduct(+id);

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

    ProductCache.removeProduct(+id);

    successResponse(res, 202, "Product has been deleted");
  } catch (error) {
    handleError(res, error);
  }
};

export const getProduct: ReqHandler = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "productId");

    const product = await ProductService.getProduct(+id);

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

      await ProductService.getProductRate(rows);
      await ProductService.getProductImages(rows);

      successResponse(res, 200, null, { result: rows, count });
    } else {
      const result = await Product.findAll({
        order: [["created_at", "DESC"]],
        raw: true,
      });

      await ProductService.getProductImages(result);
      await ProductService.getProductRate(result);

      successResponse(res, 200, null, result);
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const getProductsByGender: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const gender = get(req.query, "gender") as string;

    const { offset, limit } = getPaginationData(req.query);

    const { rows, count } = await Product.findAndCountAll({
      limit,
      offset,
      where: {
        gender,
      },
    });

    successResponse(res, 200, null, { result: rows, count });
  } catch (error) {
    handleError(res, error);
  }
};

export const getFeaturedProducts: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { offset, limit } = getPaginationData(req.query);

    const { rows, count } = await Product.findAndCountAll({
      limit,
      offset,
      where: {
        isFeatured: true,
      },
    });

    successResponse(res, 200, null, { result: rows, count });
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
          [Op.like]: `%${productName}%`,
        },
      },
      order: [["created_at", "DESC"]],
      raw: true,
    });

    await Promise.all(
      rows.map(async (product: ProductWithImages | Product) => {
        const productImages = await ProductImage.findAll({
          where: { productId: product.id },
        });

        (product as ProductWithImages)["productImages"] = productImages;
      })
    );

    successResponse(res, 200, null, { result: rows, count });
  } catch (error) {
    handleError(res, error);
  }
};

export const productFilter_1: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // top rated, ascending, descending, price low to hight, price hight to low, oldest, newest

    const { offset, limit } = getPaginationData(req.query);

    const {
      top_rate,
      ascending,
      descending,
      low_to_high,
      high_to_low,
      oldest,
      newest,
    } = req.query;

    if (top_rate) {
      const q = `select p.*, sum(r.rating) as rating from rating r
                  inner join product p
                  on p.id = r.productId
                  group by r.productId
                  order by sum(r.rating) desc`;

      const products = await sequelize.query(q, {
        raw: true,
        type: QueryTypes.SELECT,
      });

      const q_count = `select count(r.id) as count from rating r
                        group by r.productId
                        order by sum(r.rating) desc`;

      const [{ count }] = await sequelize.query(q_count, {
        raw: true,
        type: QueryTypes.SELECT,
      });

      successResponse(res, 200, null, {
        result: products,
        count: count.length,
      });
    } else if (ascending) {
      const { rows, count } = await Product.findAndCountAll({
        offset,
        limit,
        raw: true,
        order: [["productName", "ASC"]],
      });

      successResponse(res, 200, null, { result: rows, count });
    } else if (descending) {
      const { rows, count } = await Product.findAndCountAll({
        offset,
        limit,
        raw: true,
        order: [["productName", "DESC"]],
      });

      successResponse(res, 200, null, { result: rows, count });
    } else if (low_to_high) {
      const { rows, count } = await Product.findAndCountAll({
        offset,
        limit,
        raw: true,
        order: [["sale_price", "ASC"]],
      });

      successResponse(res, 200, null, { result: rows, count });
    } else if (high_to_low) {
      const { rows, count } = await Product.findAndCountAll({
        offset,
        limit,
        raw: true,
        order: [["sale_price", "DESC"]],
      });

      successResponse(res, 200, null, { result: rows, count });
    } else if (oldest) {
      const { rows, count } = await Product.findAndCountAll({
        offset,
        limit,
        raw: true,
        order: [["created_at", "ASC"]],
      });

      successResponse(res, 200, null, { result: rows, count });
    } else if (newest) {
      const { rows, count } = await Product.findAndCountAll({
        offset,
        limit,
        raw: true,
        order: [["created_at", "DESC"]],
      });

      successResponse(res, 200, null, { result: rows, count });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const productFilter_2: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // gender, color, price,

    const { offset, limit } = getPaginationData(req.query);
    const { gender, price_from, price_to, colors } = req.query;

    const { rows, count } = await Product.findAndCountAll({
      offset,
      limit,
      where: {
        [Op.and]: [
          { gender: likeParam(gender) },
          { colors: likeParam(colors) },
          {
            sale_price: {
              [Op.between]: [
                Number(price_from) || 0,
                Number(price_to) || 999999999999,
              ],
            },
          },
        ],
      },
      order: [["created_at", "DESC"]],
      raw: true,
    });

    successResponse(res, 200, null, { result: rows, count });
  } catch (error) {
    handleError(res, error);
  }
};
