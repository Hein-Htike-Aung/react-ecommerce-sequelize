import express from "express";
import { changeUserPassword, userLogin } from "../controller/AuthController";
import { credentialSchema, passwordsSchema } from "../schemas/credential.schema";
import validateRequest from "../../../../middlewares/validate_request";
import user_jwt from "../../../../middlewares/user_jwt";

const router = express.Router();

router.post(
    "/login",
    [validateRequest(credentialSchema)],
    userLogin
);

router.post(
    "/change_user_password",
    [validateRequest(passwordsSchema), user_jwt],
    changeUserPassword
);

export default router;