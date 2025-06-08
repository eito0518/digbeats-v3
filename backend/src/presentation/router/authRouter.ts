import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authController } from "../di/authController.di";

export const authRouter = Router();

// ユーザーを認証するエンドポイント
authRouter.post("/authorize", asyncHandler(authController.authorizeUser));

// ユーザーがログイン中か判定するエンドポイント
authRouter.get("/session", asyncHandler(authController.checkSession));
