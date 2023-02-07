import { object, string, number, boolean, array } from "yup";
import { paginationPayload } from "./common.schema";

const productId = {
  params: object({
    productId: string().required(),
  }),
};

const payload = {
  body: object({
    categoryId: number().required(),
    productName: string().required(),
    product_code: string().required(),
    product_sku: string().required(),
    regular_price: number().required(),
    sale_price: number().required(),
    tags: string().required(),
    sizes: string().required(),
    quantity: number().required(),
    colors: string().required(),
    gender: string().required(),
    isFeatured: boolean(),
    status: string(),
    description: string().required(),
    productImages: array().min(1),
  }),
};

export const createProductSchema = object({ ...payload });

export const updateProductSchema = object({ ...productId, ...payload });

export const productIdParam = object({ ...productId });

export const productNameQueryParam = object({
  query: object({
    productName: string().required(),
    ...paginationPayload,
  }),
});

export const productGenderQueryParam = object({
  query: object({
    gender: string().required(),
  }),
});
