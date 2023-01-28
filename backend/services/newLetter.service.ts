import { get_newLetterCache } from "../cache/newLetter.cache";
import NewLetter from "../models/newletter";

export const getNewLetterById = async (id: number) => {
  const newLetter = await get_newLetterCache(id, async () => {
    const newLetter = await NewLetter.findByPk(id);

    if (newLetter === null) return null;

    return newLetter;
  });

  return newLetter;
};

export const findAllNewLetter = async () =>
  await NewLetter.findAll({ order: [["created_at", "DESC"]], raw: true });
