import { Request, Response, NextFunction } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncHandler) => // 非同期関数を受け取る
    (req: Request, res: Response, next: NextFunction) => // Expressが実行されるタイミングで引数を受け取る
    fn(req, res, next).catch(next); // catch をつけて返す
