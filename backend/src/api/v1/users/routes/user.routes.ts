import express from "express";
import { createUser, getUsers, toggleUserStatus, updateUser } from "../controller/UserController";
import { createUserSchema, updateUserSchema, userIdParam } from "../schemas/user.schema";
import validateRequest from "../../../../middlewares/validate_request";
import user_jwt from "../../../../middlewares/user_jwt";

const router = express.Router();

router.post(
    "/create",
    [validateRequest(createUserSchema)],
    createUser
);

router.patch(
    "/update",
    [validateRequest(updateUserSchema), user_jwt],
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

// router.get(
//     "/by_fullName",
//     [validateRequest(fullNameQueryParam)],
//     getUsersByName
// );

export default router;
