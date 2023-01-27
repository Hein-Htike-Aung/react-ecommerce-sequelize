import { get_userCache } from "../cache/user.cache";
import User from "../models/user";

export const getUserById = async (id: number) => {
  const user = await get_userCache(id, async () => {
    const user = await User.findByPk(id, { raw: true });

    if (user === null) return null;
    return user;
  });

  return user;
};
