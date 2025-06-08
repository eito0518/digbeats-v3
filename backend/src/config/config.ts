import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is missing`);
  return value;
}

export const config = {
  // Node
  NODE_ENV: getEnv("NODE_ENV"),
  // MySQL
  DB_HOST: getEnv("MYSQL_HOST"),
  DB_USER: getEnv("MYSQL_USER"),
  DB_PASSWORD: getEnv("MYSQL_PASSWORD"),
  DB_NAME: getEnv("MYSQL_NAME"),
  DB_PORT: Number(getEnv("MYSQL_PORT")),
  // Redis
  REDIS_HOST: getEnv("REDIS_HOST"),
  REDIS_PORT: Number(getEnv("REDIS_PORT")),
  // SoundCloud
  CLIENT_ID: getEnv("CLIENT_ID"),
  CLIENT_SECRET: getEnv("CLIENT_SECRET"),
  REDIRECT_URI: getEnv("REDIRECT_URI"),
  API_BASE_URL: getEnv("SOUNDCLOUD_API_BASE_URL"),
  // Session
  SESSION_TTL: 60 * 60 * 24 * 2, // ２日間（秒）
};
