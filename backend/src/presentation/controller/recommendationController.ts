import { GetRecommendationUseCase } from "../../application/usecase/getRecommendationUseCase";
import { GetHistorysUseCase } from "../../application/usecase/getHistorysUseCase";
import { LikeTracksUseCase } from "../../application/usecase/likeTracksUseCase";
import { Request, Response } from "express";

export class RecommendationController {
  constructor(
    private readonly _getRecommendationUseCase: GetRecommendationUseCase,
    private readonly _getHistorysUseCase: GetHistorysUseCase,
    private readonly _likeTracksUseCase: LikeTracksUseCase
  ) {}

  // レコメンドを取得する
  async getRecommendations(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // ユースケース
    const recommendation = await this._getRecommendationUseCase.run(sessionId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({ recommendation: recommendation });
  }

  // レコメンド履歴を取得する
  async getHistorys(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // ユースケース
    const historys = await this._getHistorysUseCase.run(sessionId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({ historys: historys });
  }

  // レコメンド楽曲にいいねをする
  async likeTracks(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;
    const recommendationIdRaw = req.params.recommendationId;
    const trackIds: number[] = req.body.trackIds;

    if (typeof recommendationIdRaw !== "string") {
      res.status(400).json({ error: "Missing 'recommendationId' parameter" });
      return;
    }

    const recommendationId = Number(decodeURIComponent(recommendationIdRaw));

    // ユースケース
    await this._likeTracksUseCase.run(sessionId, recommendationId, trackIds);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({
        message: "Like tracks successfully",
      });
  }
}
