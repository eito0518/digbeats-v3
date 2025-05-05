import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { userController } from "../di/userController.di";

export const userRouter = Router();

// フォロー中のアーティストを取得するエンドポイント
userRouter.get(
  "/api/users/followings",
  asyncHandler(userController.fetchMyFollowings)
);

// アーティストをフォローするエンドポイント
userRouter.put(
  "/api/users/followings/:soundcloudArtistId",
  asyncHandler(userController.followArtist)
);
