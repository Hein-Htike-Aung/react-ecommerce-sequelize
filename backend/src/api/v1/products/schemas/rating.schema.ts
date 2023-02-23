import { object, number } from "yup";

export const createRatingSchema = object({
  body: object({
    productId: number().required(),
    rating: number().min(1).max(5).required(),
  }),
});
