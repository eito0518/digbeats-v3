import { AuthorizeUserUseCase } from "../../application/usecase/authorizeUserUseCase";
import { SoundCloudApi } from "../../infrastructure/api/soundCloudApi";
import { RedisSessionRepository } from "../../infrastructure/repositories/redisSessionRepository";

// 依存注入
const soundCloudApi = new SoundCloudApi();
const redisSessionRepository = new RedisSessionRepository();
const authorizeUserUseCase = new AuthorizeUserUseCase(
  soundCloudApi,
  redisSessionRepository
);

export const authController = async (req, res) => {
  // リクエスト
  const { code, codeVerifier } = req.body;

  // ユースケース
  const sessionId = authorizeUserUseCase.run(code, codeVerifier);

  // レスポンス
  res.cookie;
};
