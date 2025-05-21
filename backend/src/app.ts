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

  app.use(authRouter);
  app.use(userRouter);
  app.use(artistRouter);
  app.use(recommendationRouter);

  app.use(errorHandler);

  return app;
};
