import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { userController } from "../di/userController.di";

export const userRouter = Router();

userRouter.get(
  "/api/users/following",
  asyncHandler(userController.getMyFollowings)
);
