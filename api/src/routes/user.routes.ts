import express from "express";
import { createUser, getUsers, getUsersByName, toggleUserStatus, updateUser } from "../controllers/UserController";
import validateRequest from "../middlewares/validate_request";
import { createUserSchema, fullNameQueryParam, updateUserSchema, userIdParam } from "../schemas/user.schema";

const router = express.Router();

router.post(
    "/create",
    [validateRequest(createUserSchema)],
    createUser
);

router.patch(
    "/update/:userId",
    [validateRequest(updateUserSchema)],
    updateUser
);

router.get(
    "/list",
    getUsers
);

router.post(
    "/toggle_status/:userId",
    [validateRequest(userIdParam)],
    toggleUserStatus
);

router.get(
    "/by_fullName",
    [validateRequest(fullNameQueryParam)],
    getUsersByName
);

export default router;
