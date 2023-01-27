import User from "../models/user";
import restoreCache from "../utils/restoreCahce";

export const get_userCache = async (
  id: number,
  freshDataFn: () => Promise<null | User>
) => {
  return (await restoreCache(`user:${id}`, async () => {
    return freshDataFn();
  })) as User | null;
};
