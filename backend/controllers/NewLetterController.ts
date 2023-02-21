import NewLetterService from "./../services/newLetter.service";
import { Request, Response } from "express";
import { get } from "lodash";
import NewLetterCache from "../cache/newLetter.cache";
import NewLetter from "../models/newletter";
import { ReqHandler } from "../types";
import errorResponse from "../utils/errorResponse";
import handleError from "../utils/handleError";
import successResponse from "../utils/successResponse";
import { sequelize } from "../models";

export const createNewLetter: ReqHandler = async (
  req: Request,
  res: Response
) => {
  const transaction = await sequelize.transaction();
  try {
    const newLetter = await NewLetter.create({ ...req.body }, { transaction });

    if (newLetter) {
      await transaction.commit();
      await NewLetterCache.setNewLetter(newLetter);

      successResponse(res, 201, "New Letter has been created");
    }
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export const updateNewLetter: ReqHandler = async (
  req: Request,
  res: Response
) => {
  const transaction = await sequelize.transaction();
  try {
    const id = get(req.params, "newLetterId");

    const newLetter = await NewLetterService.getNewLetter(+id);

    if (!newLetter) return errorResponse(res, 404, "New letter not found");

    await newLetter.update({ ...req.body }, { where: { id }, transaction });

    const updatedNewLetter = await NewLetter.findByPk(id, { raw: true });

    if (!updatedNewLetter)
      return errorResponse(res, 404, "New letter not found");

    await transaction.commit();
    await NewLetterCache.updateNewLetter(updatedNewLetter);

    successResponse(res, 202, "New letter has been updated");
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export const deletedNewLetter: ReqHandler = async (
  req: Request,
  res: Response
) => {
  const transaction = await sequelize.transaction();
  try {
    const id = get(req.params, "newLetterId");

    const newLetter = await NewLetterService.getNewLetter(+id);

    if (!newLetter) return errorResponse(res, 404, "New letter not found");

    await NewLetter.destroy({ where: { id }, transaction });

    await transaction.commit();
    await NewLetterCache.deleteNewLetter(+id);

    successResponse(res, 202, "New letter has been deleted");
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export const getNewLetter: ReqHandler = async (req: Request, res: Response) => {
  try {
    const id = get(req.params, "newLetterId");

    const newLetter = await NewLetterService.getNewLetter(+id);

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
    const newLetters = await NewLetterCache.restoreNewLetterList();

    successResponse(res, 200, null, newLetters);
  } catch (error) {
    handleError(res, error);
  }
};
