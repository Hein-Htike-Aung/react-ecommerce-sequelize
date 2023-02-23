import redis from "../config/redis";

export const setCache = async <T>(key: string, value: T) =>
  redis.set(
    key,
    JSON.stringify(value),
    "EX",
    process.env.CACHE_EXPIRATION_TIME
      ? +process.env.CACHE_EXPIRATION_TIME
      : 600000
  );
