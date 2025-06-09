import { AuthController } from "../controller/authController";
import { AuthorizeUserUseCase } from "../../application/usecase/authorizeUserUseCase";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";
import { UserSoundCloudRepository } from "../../infrastructure/api/userSoundCloudRepository";
import { UserMysqlRepository } from "../../infrastructure/db/userMysqlRepository";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";
import { RedisClient } from "../../infrastructure/redis/redisClient";
import { CheckSessionUseCase } from "../../application/usecase/checkSessionUseCase";

export const authController = new AuthController(
  // ユーザーを認証
  new AuthorizeUserUseCase(
    new TokenSoundCloudRepository(),
    new UserSoundCloudRepository(),
    new UserMysqlRepository(),
    new SessionRedisRepository(RedisClient)
  ),
  // ログインを判定
  new CheckSessionUseCase(new SessionRedisRepository(RedisClient))
);
