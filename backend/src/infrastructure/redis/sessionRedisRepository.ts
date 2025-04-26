import Redis from "ioredis";
import {
  SessionRepository,
  SessionData,
} from "../../domain/interfaces/sessionRepository";
import { config } from "../../config/config";

const redis = new Redis();

//　 実際に session を redis に保存する実装クラス
export class SessionRedisRepository implements SessionRepository {
  async save(sessionId: string, sessionData: SessionData): Promise<void> {
    await redis.set(
      `session: ${sessionId}`,
      JSON.stringify(sessionData),
      "EX",
      config.SESSION_TTL
    );
  }
}
