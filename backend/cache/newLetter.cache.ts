import NewLetter from "../models/newletter";
import restoreCache from "../utils/restoreCahce";

export const get_newLetterCache = async (
  id: number,
  freshDataFn: () => Promise<null | NewLetter>
) => {
  return (await restoreCache<NewLetter, NewLetter | null>(
    `category:${id}`,
    async () => {
      return freshDataFn();
    }
  )) as NewLetter | null;
};
