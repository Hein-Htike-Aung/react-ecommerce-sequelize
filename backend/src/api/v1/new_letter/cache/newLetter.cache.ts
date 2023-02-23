import NewLetter from "../../../../models/newletter";
import NewLetterService from "../services/newLetter.service";
import getCache from "../../../../utils/getCache";
import restoreCache from "../../../../utils/restoreCache";
import { setCache } from "../../../../utils/setCache";

class NewLetterCache {
  // set new letter
  static setNewLetter = async (newLetter: NewLetter) => {
    let existingNewLetterCache = await getCache<NewLetter[]>("newLetters");

    if (!existingNewLetterCache) {
      existingNewLetterCache = await this.restoreNewLetterList();
    }

    setCache("newLetters", [newLetter, ...existingNewLetterCache]);
  };

  // update new letter
  static updateNewLetter = async (newLetter: NewLetter) => {
    let existingNewLetterCache = await getCache<NewLetter[]>("newLetters");

    if (!existingNewLetterCache) {
      existingNewLetterCache = await this.restoreNewLetterList();
    }

    existingNewLetterCache = existingNewLetterCache.map((l) =>
      l.id === newLetter.id ? newLetter : l
    );

    setCache("newLetters", existingNewLetterCache);
  };

  // delete new letter
  static deleteNewLetter = async (id: number) => {
    let existingNewLetterCache = await getCache<NewLetter[]>("newLetters");

    if (!existingNewLetterCache) {
      existingNewLetterCache = await this.restoreNewLetterList();
    }

    existingNewLetterCache = existingNewLetterCache.filter((l) => l.id !== id);

    setCache("newLetters", existingNewLetterCache);
  };

  // get new letter
  static getNewLetter = async (
    id: number,
    freshDataFn: () => Promise<null | NewLetter>
  ) => {
    return (await restoreCache(`newLetter:${id}`, async () =>
      freshDataFn()
    )) as NewLetter;
  };

  // restore new letter list
  static restoreNewLetterList = async () => {
    return (await restoreCache<NewLetter[], NewLetter[] | null>(
      `newLetters`,
      async () => await NewLetterService.getAllNewLetterQuery()
    )) as NewLetter[];
  };
}

export default NewLetterCache;
