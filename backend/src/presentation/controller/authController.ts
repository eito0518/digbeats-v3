import { AuthorizeUserUseCase } from "../../application/usecase/authorizeUserUseCase";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";
import { UserSoundCloudRepository } from "../../infrastructure/api/userSoundCloudRepository";
import { UserMysqlRepository } from "../../infrastructure/db/userMysqlRepository";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";
import { Request, Response } from "express";

// 依存注入
const authorizeUserUseCase = new AuthorizeUserUseCase(
  new TokenSoundCloudRepository(),
  new UserSoundCloudRepository(),
  new UserMysqlRepository(),
  new SessionRedisRepository()
);

export const authController = async (req: Request, res: Response) => {
  // リクエスト
  const { code, codeVerifier } = req.body;

  // ユースケース
  const sessionId = authorizeUserUseCase.run(code, codeVerifier);

  // レスポンス
  res
    .cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // TODO：　CSRF対策　で　csurfを導入する
    })
    .status(200)
    .json({
      message: "Session cookie set",
    });
};
