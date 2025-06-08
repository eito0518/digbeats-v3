import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { userController } from "../di/userController.di";

export const userRouter = Router();

// 自分のユーザー情報を取得するエンドポイント
userRouter.get("/", asyncHandler(userController.fetchMyUserInfo));

// フォロー中のアーティストを取得するエンドポイント
userRouter.get("/followings", asyncHandler(userController.fetchMyFollowings));

// アーティストをフォローするエンドポイント
userRouter.post("/followings", asyncHandler(userController.followArtist));

// アーティストをフォロー解除するエンドポイント
userRouter.delete("/followings", asyncHandler(userController.unfollowArtist));

// 楽曲のいいねを登録するエンドポイント
userRouter.post("/likes", asyncHandler(userController.likeTrack));

// 楽曲のいいねを解除するエンドポイント
userRouter.delete("/likes", asyncHandler(userController.unlikeTrack));
