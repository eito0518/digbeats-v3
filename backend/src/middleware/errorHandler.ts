import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Unexpected error occurred", err);

  // 再認証を要求するエラー（セッション切れなど）
  if (err.message === "REAUTH_REQUIRED") {
    res.status(401).json({
      message: "REAUTH_REQUIRED",
    });
    return;
  }

  // それ以外のエラーは 500 として処理
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
};
