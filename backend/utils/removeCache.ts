import redis from "../config/redis";

export const removeCache = (key: string) => redis.del(key);
