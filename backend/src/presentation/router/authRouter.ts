import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authController } from "../di/authController.di";
import { sessionHandler } from "../../middleware/sessionHandler";

export const authRouter = Router();

// ユーザーを認証するエンドポイント
authRouter.post("/authorize", asyncHandler(authController.authorizeUser));

// ユーザーがログイン中か判定するエンドポイント
// ミドルウェア(sessionHandler)を適応
authRouter.get(
  "/session",
  sessionHandler,
  asyncHandler(authController.checkSession)
);
