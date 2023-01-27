import { Request, Response } from "express";
import { get } from "lodash";
import NewLetter from "../models/newletter";
import { getNewLetterById } from "../services/newLetter.service";
import { ReqHandler } from "../types";
import errorResponse from "../utils/errorResponse";
import getPaginationData from "../utils/getPaginationData";
import handleError from "../utils/handleError";
import successResponse from "../utils/successResponse";

export const createNewLetter: ReqHandler = async (
  req: Request,
  res: Response
) => {
  try {
    await NewLetter.create({ ...req.body });
    successResponse(res, 201, "New Letter has been created");
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

    await NewLetter.update({ ...req.body }, { where: { id } });

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
    const { offset, limit } = getPaginationData(req.query);

    const { rows, count } = await NewLetter.findAndCountAll({
      offset,
      limit,
      order: [["created_at", "DESC"]],
      raw: true,
    });

    successResponse(res, 200, null, { result: rows, count });
  } catch (error) {
    handleError(res, error);
  }
};
