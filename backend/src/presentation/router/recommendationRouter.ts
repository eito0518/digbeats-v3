import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { recommendationController } from "../di/recommendationController.di";

export const recommendationRouter = Router();

// レコメンドを取得するエンドポイント
recommendationRouter.get(
  "/api/recommendations",
  asyncHandler(recommendationController.getRecommendations)
);

// レコメンド履歴を取得するエンドポイント
recommendationRouter.get(
  "/api/recommendations/historys",
  asyncHandler(recommendationController.getHistorys)
);
