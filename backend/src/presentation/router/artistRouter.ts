import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { artistController } from "../di/artistController.di";
import { sessionHandler } from "../../middleware/sessionHandler";

export const artistRouter = Router();

// ミドルウェア
artistRouter.use(sessionHandler);

// アーティストを検索するエンドポイント
artistRouter.get("/search", asyncHandler(artistController.searchArtists));
