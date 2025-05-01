import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { userController } from "../controller/userController";

export const userRouter = Router();

userRouter.get("/api/users/following", asyncHandler(userController));
