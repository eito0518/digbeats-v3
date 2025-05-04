import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { artistController } from "../di/artistController.di";

export const artistRouter = Router();

artistRouter.get("/api/artists", asyncHandler(artistController.searchArtists));
