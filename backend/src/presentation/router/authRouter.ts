import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authController } from "../controller/authController";

export const authRouter = Router();

authRouter.post("/api/auth/authorize", asyncHandler(authController));
