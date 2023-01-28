import { findAllNewLetter } from './../services/newLetter.service';
import { Request, Response } from "express";
import { get } from "lodash";
import {
  deleteNewLetterCache,
  getNewLetterListCache,
  setNewLetterCache,
  updateNewLetterCache,
} from "../cache/newLetter.cache";
import NewLetter from "../models/newletter";
import { getNewLetterById } from "../services/newLetter.service";
import { ReqHandler } from "../types";
import errorResponse from "../utils/errorResponse";
import handleError from "../utils/handleError";
import successResponse from "../utils/successResponse";

export const createNewLetter: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const newLetter = await NewLetter.create({ ...req.body });

    if (newLetter) {
      await setNewLetterCache(newLetter);

      successResponse(res, 201, "New Letter has been created");
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const updateNewLetter: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "newLetterId");

    const newLetter = await getNewLetterById(+id);

    if (!newLetter) return errorResponse(res, 404, "New letter not found");

    await newLetter.update({ ...req.body }, { where: { id } });

    const updatedNewLetter = await NewLetter.findByPk(id, { raw: true });

    console.log(updatedNewLetter);

    if (!updatedNewLetter)
      return errorResponse(res, 404, "New letter not found");

    await updateNewLetterCache(updatedNewLetter);

    successResponse(res, 202, "New letter has been updated");
  } catch (error) {
    handleError(res, error);
  }
};

export const deletedNewLetter: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = get(req.params, "newLetterId");

    const newLetter = await getNewLetterById(+id);

    if (!newLetter) return errorResponse(res, 404, "New letter not found");

    await NewLetter.destroy({ where: { id } });

    await deleteNewLetterCache(+id);

    successResponse(res, 202, "New letter has been deleted");
  } catch (error) {
    handleError(res, error);
  }
};

export const getNewLetter: ReqHandler = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "newLetterId");

    const newLetter = await getNewLetterById(+id);

    if (!newLetter) return errorResponse(res, 404, "New letter not found");

    successResponse(res, 200, null, newLetter);
  } catch (error) {
    handleError(res, error);
  }
};

export const getNewLetters: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const newLetters = await getNewLetterListCache(
      async () => await findAllNewLetter()
    );

    successResponse(res, 200, null, newLetters);
  } catch (error) {
    handleError(res, error);
  }
};
