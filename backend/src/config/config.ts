import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is missing`);
  return value;
}

export const config = {
  // SoundCloud
  clientId: getEnv("CLIENT_ID"),
  clientSecret: getEnv("CLIENT_SECRET"),
  redirectUri: getEnv("REDIRECT_URI"),
  // Session
  sessionTTL: 60 * 60 * 24 * 2, // ２日間（秒）
};
