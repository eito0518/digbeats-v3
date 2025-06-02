import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { userController } from "../di/userController.di";

export const userRouter = Router();

// 自分のユーザー情報を取得するエンドポイント
userRouter.get("/api/users", asyncHandler(userController.fetchMyUserInfo));

// フォロー中のアーティストを取得するエンドポイント
userRouter.get(
  "/api/users/followings",
  asyncHandler(userController.fetchMyFollowings)
);

// アーティストをフォローするエンドポイント
userRouter.post(
  "/api/users/followings",
  asyncHandler(userController.followArtist)
);

// アーティストをフォロー解除するエンドポイント
userRouter.delete(
  "/api/users/followings",
  asyncHandler(userController.unfollowArtist)
);

// いいねした楽曲の SoundCloudTrackId を取得するエンドポイント
userRouter.get(
  "/api/users/likes",
  asyncHandler(userController.fetchLikedSoundCloudTrackIds)
);
