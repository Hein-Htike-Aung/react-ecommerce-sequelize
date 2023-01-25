import redis from "../config/redis";

export const pushCache = async <T>(key: string, value: T) => {
  await redis.lpush(
    key,
    JSON.stringify(value),
    "EX",
    process.env.CACHE_EXPIRATION_TIME
      ? +process.env.CACHE_EXPIRATION_TIME
      : 600000
  );
};
