import { Request, Response, NextFunction } from "express";
import { validateSessionId } from "../presentation/utils/validation";

export const sessionHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // sessionIdを取得
  const sessionId = req.cookies.sessionId;

  // sessionIdを検証
  validateSessionId(sessionId);

  // レスポンスにクッキーを設定
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    domain: ".digbeats.jp",
    sameSite: "lax",
  });

  next();
};
