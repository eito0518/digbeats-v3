import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authController } from "../di/authController.di";

export const authRouter = Router();

// ユーザーを認証するエンドポイント
authRouter.post(
  "/api/auth/authorize",
  asyncHandler(authController.authorizeUser)
);
