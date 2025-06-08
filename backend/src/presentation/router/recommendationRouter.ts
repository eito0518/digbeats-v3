import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { recommendationController } from "../di/recommendationController.di";

export const recommendationRouter = Router();

// レコメンドを取得するエンドポイント
recommendationRouter.get(
  "/",
  asyncHandler(recommendationController.getRecommendation)
);

// 「今日のレコメンド」を取得するエンドポイント
recommendationRouter.get(
  "/today",
  asyncHandler(recommendationController.getTodayRecommendations)
);

// レコメンド履歴を取得するエンドポイント
recommendationRouter.get(
  "/histories",
  asyncHandler(recommendationController.getHistories)
);
