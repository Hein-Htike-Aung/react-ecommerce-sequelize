import NewLetter from "../models/newletter";
import { findAllNewLetter } from "../services/newLetter.service";
import getCache from "../utils/getCache";
import restoreCache from "../utils/restoreCahce";
import { setCache } from "../utils/setCache";

export const setNewLetterCache = async (newLetter: NewLetter) => {
  let existingNewLetterCache = await getCache<NewLetter[]>("newLetters");

  if (!existingNewLetterCache.length) {
    existingNewLetterCache = await restoreNewLetterListCache();
  }

  setCache("newLetters", [newLetter, ...existingNewLetterCache]);
};

export const updateNewLetterCache = async (newLetter: NewLetter) => {
  let existingNewLetterCache = await getCache<NewLetter[]>("newLetters");

  if (!existingNewLetterCache.length) {
    existingNewLetterCache = await restoreNewLetterListCache();
  }

  existingNewLetterCache = existingNewLetterCache.map((l) =>
    l.id === newLetter.id ? newLetter : l
  );

  setCache("newLetters", existingNewLetterCache);
};

export const deleteNewLetterCache = async (id: number) => {
  let existingNewLetterCache = await getCache<NewLetter[]>("newLetters");

  if (!existingNewLetterCache.length) {
    existingNewLetterCache = await restoreNewLetterListCache();
  }

  existingNewLetterCache = existingNewLetterCache.filter((l) => l.id !== id);

  setCache("newLetters", existingNewLetterCache);
};

export const restoreNewLetterListCache = async () => {
  return (await restoreCache<NewLetter[], NewLetter[] | null>(
    `newLetters`,
    async () => await findAllNewLetter()
  )) as NewLetter[];
};

export const get_newLetterCache = async (
  id: number,
  freshDataFn: () => Promise<null | NewLetter>
) => {
  return (await restoreCache(`newLetter:${id}`, async () => {
    return freshDataFn();
  })) as NewLetter;
};

export const getNewLetterListCache = async (
  freshDataFn: () => Promise<null | NewLetter[]>
) => {
  return (await restoreCache<NewLetter[], NewLetter[] | null>(
    `newLetters`,
    async () => {
      return freshDataFn();
    }
  )) as NewLetter[];
};
