import { RedisData, RedisError } from "../../types";
import redis from "../config/redis";

const getCache = async <T>(key: string): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    redis.get(key, (error: RedisError, data: T | RedisData) => {
      if (error) return reject(error);

      if (data !== "null" && typeof data === "string")
        return resolve(JSON.parse(data) as T);
      else return resolve([] as T);
    });
  });
};

export default getCache;
