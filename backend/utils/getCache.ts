import redis from "../config/redis";
import { RedisData, RedisError } from "../types";

const getCache = <T>(key: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    redis.get(key, (error: RedisError, data: T | RedisData) => {
      if (error) return reject(error);

      if (data !== null && typeof data === "string")
        return resolve(JSON.parse(data) as T);
    });
  });
};

export default getCache;
