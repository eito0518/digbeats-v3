import Redis, { RedisOptions } from "ioredis";
import { config } from "../../config/config";

// 接続の設定
const options: RedisOptions = {
  // ホストを設定
  host: config.CACHE_HOST,
  // ポート番号を設定
  port: config.CACHE_PORT,
  // もしパスワードがある場合は設定 （オプショナル）
  password: config.CACHE_PASSWORD,
  // 本番環境（Azure）の場合は通信を暗号化(SSL/TLS)接続を設定
  tls: config.NODE_ENV === "production" ? {} : undefined, // 本番環境の場合は空オブジェクト{}を設定
  // タイムアウトを設定
  connectTimeout: 10000,
};

export const RedisClient = new Redis(options);

RedisClient.on("error", (error) => {
  console.error("[redisClient] Redis Client Error", error);
});
