import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config/config";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./presentation/router/authRouter";
import { userRouter } from "./presentation/router/userRouter";
import { artistRouter } from "./presentation/router/artistRouter";
import { recommendationRouter } from "./presentation/router/recommendationRouter";

export const createApp = () => {
  const app = express();

  // 許可するオリジン（ドメイン）のリストを定義
  const allowedOrigins = [
    "https://localhost:3000", // 開発環境
    "https://www.digbeats.jp", // 本番環境(カスタムドメイン）
  ];

  if (config.NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan("dev"));
  }
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: allowedOrigins, // 複数のオリジンを許可
      credentials: true, // Cookieの送受信を許可
    })
  );

  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/artists", artistRouter);
  app.use("/api/recommendations", recommendationRouter);

  app.use(errorHandler);

  return app;
};
