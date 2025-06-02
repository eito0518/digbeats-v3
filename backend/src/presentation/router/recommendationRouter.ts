import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { recommendationController } from "../di/recommendationController.di";

export const recommendationRouter = Router();

// レコメンドを取得するエンドポイント
recommendationRouter.get(
  "/api/recommendations",
  asyncHandler(recommendationController.getRecommendation)
);

// 「今日のレコメンド」を取得するエンドポイント
recommendationRouter.get(
  "/api/recommendations/today",
  asyncHandler(recommendationController.getTodayRecommendations)
);

// レコメンド履歴を取得するエンドポイント
recommendationRouter.get(
  "/api/recommendations/histories",
  asyncHandler(recommendationController.getHistorys)
);

// レコメンド楽曲にいいねをするエンドポイント
recommendationRouter.post(
  "/api/recommendations/:recommendationId/likes",
  asyncHandler(recommendationController.likeTracks)
);
