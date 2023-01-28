import { object, string, number } from "yup";

const categoryId = {
  params: object({
    categoryId: string().required(),
  }),
};

const payload = {
  body: object({
    categoryName: string().required(),
    parentCategoryId: number().required(),
    description: string().required(),
    img: string().required(),
  }),
};

export const createCategorySchema = object({ ...payload });

export const updateCategorySchema = object({ ...categoryId, ...payload });

export const categoryIdParam = object({ ...categoryId });
