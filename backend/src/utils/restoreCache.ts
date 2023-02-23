import { RedisData, RedisError } from "../../types";
import redis from "../config/redis";

const restoreCache = async <T, V>(
  key: string,
  freshDataFn: () => Promise<V>
) => {
  return new Promise((resolve, reject) => {
    redis.get(key, async (error: RedisError, data: T | RedisData) => {
      if (error) return reject(error);

      if (data !== "null" && typeof data === "string")
        return resolve(JSON.parse(data));

      const freshData = await freshDataFn();
      redis.set(
        key,
        JSON.stringify(freshData),
        "EX",
        process.env.CACHE_EXPIRATION_TIME
          ? +process.env.CACHE_EXPIRATION_TIME
          : 600000
      );
      resolve(freshData);
    });
  });
};

export default restoreCache;
