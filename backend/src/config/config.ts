// 環境変数を取得する関数
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is missing`);
  return value;
}

// オプショナルな環境変数を取得する関数
function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

export const config = {
  // Node
  NODE_ENV: getEnv("NODE_ENV"),
  // Server
  PORT: getEnv("PORT"),
  // API
  API_BASE_URL: getEnv("API_BASE_URL"),
  // Database
  DB_HOST: getEnv("DB_HOST"),
  DB_USER: getEnv("DB_USER"),
  DB_PASSWORD: getEnv("DB_PASSWORD"),
  DB_NAME: getEnv("DB_NAME"),
  DB_PORT: Number(getEnv("DB_PORT")),
  // Cache
  CACHE_HOST: getEnv("CACHE_HOST"),
  CACHE_PORT: Number(getEnv("CACHE_PORT")),
  CACHE_PASSWORD: getOptionalEnv("CACHE_PASSWORD"),
  // OAuth
  OAUTH_CLIENT_ID: getEnv("OAUTH_CLIENT_ID"),
  OAUTH_CLIENT_SECRET: getEnv("OAUTH_CLIENT_SECRET"),
  OAUTH_REDIRECT_URI: getEnv("OAUTH_REDIRECT_URI"),
  // Session
  SESSION_TTL: 60 * 60 * 24 * 2, // ２日間（秒）
};
