import { setCache } from "./../utils/setCache";
import User from "../models/user";
import UserService from "../services/user.service";
import getCache from "../utils/getCache";
import restoreCache from "../utils/restoreCache";

class UserCache {
  // set user
  static setUser = async (user: User) => {
    let existingUsersCache = await getCache<User[]>("users");

    if (!existingUsersCache) {
      existingUsersCache = await this.restoreUserList();
    }

    setCache("users", [user, ...existingUsersCache]);
  };

  // update user
  static updateUser = async (user: User) => {
    let existingUsersCache = await getCache<User[]>("users");

    if (!existingUsersCache) {
      existingUsersCache = await this.restoreUserList();
    }

    existingUsersCache = existingUsersCache.map((u) =>
      u.id === user.id ? user : u
    );

    setCache("users", existingUsersCache);
  };

  // get user
  static getUser = async (
    id: number,
    freshDataFn: () => Promise<null | User>
  ) => {
    return (await restoreCache(`user:${id}`, async () =>
      freshDataFn()
    )) as User | null;
  };

  // modify single user
  static modifyUser = async (id: number, value: User) => {
    await setCache(`user:${id}`, value);
  };

  // restore user list
  static restoreUserList = async () => {
    return (await restoreCache(
      `users`,
      async () => await UserService.getAllUserQuery()
    )) as User[];
  };
}

export default UserCache;
