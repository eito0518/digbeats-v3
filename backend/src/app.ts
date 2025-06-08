import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./presentation/router/authRouter";
import { userRouter } from "./presentation/router/userRouter";
import { artistRouter } from "./presentation/router/artistRouter";
import { recommendationRouter } from "./presentation/router/recommendationRouter";
import { errorHandler } from "./middleware/errorHandler";

export const createApp = () => {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "https://localhost:3000", // フロントエンドのURL　（https コールバックのため）
      credentials: true, // Cookieを許可
    })
  );

  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/artists", artistRouter);
  app.use("/api/recommendations", recommendationRouter);

  app.use(errorHandler);

  return app;
};
