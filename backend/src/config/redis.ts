import Redis from "ioredis";

const redis = new Redis();

// const redis = new Redis({
//   enableAutoPipelining: true,
//   enableTLSForSentinelMode: true,
//   path: "redis://redis:6379",
//   sentinels: [{ host: "127.0.0.1", port: 6379 }],
// });

export default redis;
