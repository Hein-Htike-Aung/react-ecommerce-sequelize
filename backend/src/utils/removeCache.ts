import redis from "../config/redis";

export const removeCache = async (key: string) => await redis.del(key);
