import { object, string, boolean } from "yup";
import { paginationPayload } from "./common.schema";

const userId = {
  params: object({
    userId: string().required(),
  }),
};

const payload = {
  body: object({
    fullName: string().required(),
    email: string().required(),
    password: string().required(),
    phone: string().required(),
    status: boolean(),
    img: string(),
    gender: string().required(),
    role: string().required(),
  }),
};

export const createUserSchema = object({ ...payload });

export const updateUserSchema = object({ ...userId, ...payload });

export const userIdParam = object({ ...userId });

export const fullNameQueryParam = object({
  query: object({
    fullName: string().required(),
    ...paginationPayload,
  }),
});
