import { GetRecommendationUseCase } from "../../application/usecase/getRecommendationUseCase";
import { GetTodayRecommendationsUseCase } from "../../application/usecase/getTodayRecommendationsUseCase";
import { GetHistoriesUseCase } from "../../application/usecase/getHistoriesUseCase";
import { Request, Response } from "express";
import { validateSessionId } from "../utils/validation";
import { RecommendationPresenter } from "../presenter/recommendationPresenter";

export class RecommendationController {
  constructor(
    private readonly _getRecommendationUseCase: GetRecommendationUseCase,
    private readonly _getTodayRecommendationsUseCase: GetTodayRecommendationsUseCase,
    private readonly _getHistoriesUseCase: GetHistoriesUseCase
  ) {}

  // レコメンドを取得する
  async getRecommendation(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // バリデーション
    if (!validateSessionId(sessionId, res)) return;

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
      .json(RecommendationPresenter.toDTO(recommendation));
  }

  // 「今日のレコメンド」 を取得する
  async getTodayRecommendations(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // バリデーション
    if (!validateSessionId(sessionId, res)) return;

    // ユースケース
    const todayRecommendations = await this._getTodayRecommendationsUseCase.run(
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
      .json(RecommendationPresenter.toDTOList(todayRecommendations));
  }

  // レコメンド履歴を取得する
  async getHistories(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // バリデーション
    if (!validateSessionId(sessionId, res)) return;

    // ユースケース
    const histories = await this._getHistoriesUseCase.run(sessionId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json(RecommendationPresenter.toDTOList(histories));
  }
}
