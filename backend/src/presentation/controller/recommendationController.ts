import { GetRecommendationUseCase } from "../../application/usecase/getRecommendationUseCase";
import { GetRecommendationHistorysUseCase } from "../../application/usecase/getRecommendationHistorysUseCase";
import { Request, Response } from "express";

export class RecommendationController {
  constructor(
    private readonly _getRecommendationUseCase: GetRecommendationUseCase,
    private readonly _getRecommendationHistorysUseCase: GetRecommendationHistorysUseCase
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
    const historys = await this._getRecommendationHistorysUseCase.run(
      sessionId
    );

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
}
