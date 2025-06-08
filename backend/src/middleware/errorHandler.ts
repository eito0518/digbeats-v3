import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ReauthenticationRequiredError } from "../errors/application.error";
import { RecommendationRequirementsNotMetError } from "../errors/domain.errors";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("An error occurred:", err);

  // 再認証を要求するエラーの場合（セッション切れなど）
  if (err instanceof ReauthenticationRequiredError) {
    res.status(401).json({
      // 401 Unauthorized
      error_code: "REAUTH_REQUIRED",
      message: err.message,
    });
    return;
  }

  // レコメンドの要件不足を伝えるエラーの場合
  if (err instanceof RecommendationRequirementsNotMetError) {
    res.status(403).json({
      // 403 Forbidden
      error_code: "REQUIREMENTS_NOT_MET",
      message: err.message,
    });
    return;
  }

  // その他の予期せぬエラー
  res.status(500).json({
    error_code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred on the server.",
  });
};
