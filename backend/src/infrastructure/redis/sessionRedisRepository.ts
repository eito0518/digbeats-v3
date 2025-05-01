import Redis from "ioredis";
import { SessionRepository } from "../../domain/interfaces/sessionRepository";
import { Session } from "../../domain/valueObjects/session";
import { config } from "../../config/config";

const redis = new Redis();

export class SessionRedisRepository implements SessionRepository {
  // セッションを保存
  async save(sessionId: string, session: Session): Promise<void> {
    await redis.set(
      `session: ${sessionId}`,
      JSON.stringify(session.toObject()), // JSONオブジェクトをJSON文字列に変換
      "EX",
      config.SESSION_TTL
    );
  }

  //　セッションを取得
  async get(sessionId: string): Promise<Session | null> {
    const rawSession = await redis.get(`session: ${sessionId}`);
    // セッションがなければnullを返す
    if (!rawSession) {
      return null;
    }

    return Session.fromJSON(rawSession);
  }
}
