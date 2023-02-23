import express from "express";
import { createNewLetter, deletedNewLetter, getNewLetter, getNewLetters, updateNewLetter } from "../controller/NewLetterController";
import { createNewLetterSchema, newLetterIdParam, updateNewLetterSchema } from "../schemas/newLetter.schema";
import validateRequest from "../../../../middlewares/validate_request";

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
    getNewLetters
);

export default router;