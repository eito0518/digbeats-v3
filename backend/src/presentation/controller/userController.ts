import { Request, Response } from "express";
import { FetchMyFollowingsUseCase } from "../../application/usecase/fetchMyFollowingsUseCase";
import { FollowArtistUseCase } from "../../application/usecase/followArtistUseCase";

export class UserController {
  constructor(
    private readonly _fetchMyFollowingsUseCase: FetchMyFollowingsUseCase,
    private readonly _followArtistUseCase: FollowArtistUseCase
  ) {}

  // フォロー中のアーティストを取得する
  async fetchMyFollowings(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // ユースケース
    const followings = await this._fetchMyFollowingsUseCase.run(sessionId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({
        followings: followings,
      });
  }

  // アーティストをフォローする
  async followArtist(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;
    const soundcloudArtistIdRaw = req.params.soundcloudArtistId;

    if (typeof soundcloudArtistIdRaw !== "string") {
      res.status(400).json({ error: "Missing 'soundcloudArtistId' parameter" });
      return;
    }

    const soundcloudArtistId = Number(
      decodeURIComponent(soundcloudArtistIdRaw)
    );

    // ユースケース
    await this._followArtistUseCase.run(sessionId, soundcloudArtistId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({
        message: "Followed artist successfully",
      });
  }
}
