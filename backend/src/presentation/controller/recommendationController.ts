import { GetRecommendationUseCase } from "../../application/usecase/getRecommendationUseCase";
import { GetTodayRecommendationsUseCase } from "../../application/usecase/getTodayRecommendationsUseCase";
import { GetHistoriesUseCase } from "../../application/usecase/getHistoriesUseCase";
import { Request, Response } from "express";
import { RecommendationPresenter } from "../presenter/recommendationPresenter";

export class RecommendationController {
  constructor(
    private readonly _getRecommendationUseCase: GetRecommendationUseCase,
    private readonly _getTodayRecommendationsUseCase: GetTodayRecommendationsUseCase,
    private readonly _getHistoriesUseCase: GetHistoriesUseCase
  ) {}

  // レコメンドを取得する
  getRecommendation = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // ユースケース
    const recommendation = await this._getRecommendationUseCase.run(sessionId);

    // レスポンス
    res.status(200).json(RecommendationPresenter.toDTO(recommendation));
  };

  // 「今日のレコメンド」 を取得する
  getTodayRecommendations = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // ユースケース
    const todayRecommendations = await this._getTodayRecommendationsUseCase.run(
      sessionId
    );

    // レスポンス
    res
      .status(200)
      .json(RecommendationPresenter.toDTOList(todayRecommendations));
  };

  // レコメンド履歴を取得する
  getHistories = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // ユースケース
    const histories = await this._getHistoriesUseCase.run(sessionId);

    // レスポンス
    res.status(200).json(RecommendationPresenter.toDTOList(histories));
  };
}
