import { object, ref, string } from "yup";

export const credentialSchema = object({
  body: object({
    email: string().required(),
    password: string().required(),
  }),
});

export const passwordsSchema = object({
  body: object({
    oldPassword: string().required(),
    newPassword: string()
      .required()
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        "Password must be strong password."
      ),
    confirmPassword: string().oneOf(
      [ref("newPassword"), null],
      "Passwords do not match"
    ),
  }),
});
