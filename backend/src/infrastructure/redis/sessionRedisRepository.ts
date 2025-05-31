import Redis from "ioredis";
import { SessionRepository } from "../../domain/interfaces/sessionRepository";
import { Session } from "../../domain/valueObjects/session";
import { config } from "../../config/config";

export class SessionRedisRepository implements SessionRepository {
  constructor(private readonly _redis: Redis) {}
  // セッションを保存
  async save(sessionId: string, session: Session): Promise<void> {
    try {
      await this._redis.set(
        `session: ${sessionId}`,
        JSON.stringify(session.toObject()), // JSONオブジェクトをJSON文字列に変換
        "EX",
        config.SESSION_TTL
      );
    } catch (error) {
      console.error(
        "[sessionRedisRepository] Failed to save session: Redis write operation failed",
        error
      );
      throw new Error("Failed to save session: Redis write operation failed");
    }
  }

  //　セッションを取得
  async get(sessionId: string): Promise<Session> {
    try {
      const rawSession = await this._redis.get(`session: ${sessionId}`);

      // セッションがなければ再ログインを要求
      if (rawSession === null) {
        throw new Error("REAUTH_REQUIRED"); // 再認証の必要を通知
      }

      return Session.fromJSON(rawSession);
    } catch (error) {
      const message =
        error instanceof Error && error.message === "REAUTH_REQUIRED" // エラーメッセージが "REAUTH_REQUIRED" かどうか
          ? "REAUTH_REQUIRED"
          : "Failed to fetch session: Redis read operation failed";
      console.error(`[sessionRedisRepository] ${message}`, error);
      throw new Error(message);
    }
  }
}
