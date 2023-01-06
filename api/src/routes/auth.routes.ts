import express from "express";
import { changeUserPassword, userLogin } from "../controllers/AuthController";
import jwt_auth from "../middlewares/jwt_auth";
import validateRequest from "../middlewares/validate_request";
import { credentialSchema, passwordsSchema } from "../schemas/credential.schema";

const router = express.Router();

router.post(
    "/login",
    [validateRequest(credentialSchema)],
    userLogin
);

router.post(
    "/change_user_password",
    [validateRequest(passwordsSchema), jwt_auth],
    changeUserPassword
);

export default router;