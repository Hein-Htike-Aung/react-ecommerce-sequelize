import express from "express";
import { createNewLetter, deletedNewLetter, getNewLetter, getNewLetters, updateNewLetter } from "../controllers/NewLetterController";
import validateRequest from "../middlewares/validate_request";
import { paginationQuery } from "../schemas/common.schema";
import { createNewLetterSchema, newLetterIdParam, updateNewLetterSchema } from "../schemas/newLetter.schema";

const router = express.Router();

router.post(
    "/create",
    [validateRequest(createNewLetterSchema)],
    createNewLetter
);

router.patch(
    "/update/:newLetterId",
    [validateRequest(updateNewLetterSchema)],
    updateNewLetter
);

router.delete(
    "/delete/:newLetterId",
    [validateRequest(newLetterIdParam)],
    deletedNewLetter
);

router.get(
    "/by_id/:newLetterId",
    [validateRequest(newLetterIdParam)],
    getNewLetter
);

router.get(
    "/list",
    [validateRequest(paginationQuery)],
    getNewLetters
);

export default router;