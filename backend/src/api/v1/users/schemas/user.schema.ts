import { object, string, boolean } from "yup";
import { paginationPayload } from "../../../../utils/common.schema";

const userId = {
  params: object({
    userId: string().required(),
  }),
};

const payload = {
  body: object({
    fullName: string().required(),
    email: string().required(),
    password: string()
      .required()
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        "Password must be strong password."
      ),
    phone: string().required(),
    status: boolean(),
    img: string(),
    gender: string().required(),
    role: string().required(),
    about: string(),
  }),
};

export const createUserSchema = object({ ...payload });

export const updateUserSchema = object({
  body: object({
    fullName: string().required(),
    phone: string().required(),
    img: string(),
    gender: string().required(),
    about: string(),
  }),
});

export const userIdParam = object({ ...userId });

export const fullNameQueryParam = object({
  query: object({
    fullName: string().required(),
    ...paginationPayload,
  }),
});
