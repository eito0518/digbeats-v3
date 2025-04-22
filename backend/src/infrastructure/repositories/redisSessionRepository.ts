import Redis from "ioredis";
import {
  SessionRepository,
  sessionData,
} from "../../domain/interfaces/sessionRepository";
import { config } from "../../config/config";

const redis = new Redis();

//　 実際に session を redis に保存する実装クラス
export class RedisSessionRepository implements SessionRepository {
  async save(sessionId: string, sessionData: sessionData): Promise<void> {
    await redis.set(
      `session: ${sessionId}`,
      JSON.stringify(sessionData),
      "EX",
      config.sessionTTL
    );
  }
}
