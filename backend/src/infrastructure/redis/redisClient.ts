import Redis from "ioredis";
import { config } from "../../config/config";

export const RedisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
});
