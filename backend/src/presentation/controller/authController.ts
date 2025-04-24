import { AuthorizeUserUseCase } from "../../application/usecase/authorizeUserUseCase";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";
import { UserSoundCloudRepository } from "../../infrastructure/api/userSoundCloudRepository";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";

// 依存注入
const authorizeUserUseCase = new AuthorizeUserUseCase(
  new TokenSoundCloudRepository(),
  new UserSoundCloudRepository(),
  new SessionRedisRepository()
);

export const authController = async (req, res) => {
  // リクエスト
  const { code, codeVerifier } = req.body;

  // ユースケース
  const sessionId = authorizeUserUseCase.run(code, codeVerifier);

  // レスポンス
  res.cookie;
};
