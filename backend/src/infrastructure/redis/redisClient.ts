import Redis from "ioredis";
import { config } from "../../config/config";

export const RedisClient = new Redis({
  host: config.CACHE_HOST,
  port: config.CACHE_PORT,
});
