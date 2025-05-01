import { Request, Response } from "express";
import { FetchMyFollowingsUseCase } from "../../application/usecase/fetchMyFollowingsUseCase";
import { TokenApplicationService } from "../../application/applicationSercices/tokenApplicationService";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";

const fetchMyFollowingsUseCase = new FetchMyFollowingsUseCase(
  new TokenApplicationService(
    new SessionRedisRepository(),
    new TokenSoundCloudRepository()
  )
);

export const userController = async (req: Request, res: Response) => {
  // リクエスト
  const sessionId = req.cookies.sessionId;
  // ユースケース
  const followings = fetchMyFollowingsUseCase.run(sessionId);
  // レスポンス
  res
    .cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
    })
    .status(200)
    .json({
      followings: [
        // {
        //     name: Travis Sccott,
        //     avatar_url: https:~,
        //     public_favorites_count: 123,
        //     permalink_url: https:~,
        //   },
        //   ...
      ],
    });
};
