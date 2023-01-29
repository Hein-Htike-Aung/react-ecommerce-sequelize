import UserCache from "../cache/user.cache";
import User from "../models/user";

class UserService {
  // get user
  static getUser = async (id: number) => {
    const user = await UserCache.getUser(id, async () => {
      const user = await User.findByPk(id, { raw: true });

      if (user === null) return null;
      return user;
    });

    return user;
  };

  // get all users query
  static getAllUserQuery = async () =>
    await User.findAll({ order: [["created_at", "DESC"]], raw: true });
}

export default UserService;
