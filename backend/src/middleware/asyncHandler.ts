import { Request, Response, NextFunction } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// 目的：　　try-catch文を何度も書くのを防ぐ
// 役割：　　非同期関数をラップして、Promiseでエラーが起きたとき処理を行う

export const asyncHandler =
  (
    fn: AsyncHandler // 非同期関数を受け取る
  ) =>
  (
    req: Request,
    res: Response,
    next: NextFunction // Expressが実行されるタイミングで引数を受け取る
  ) =>
    fn(req, res, next).catch(next); // 非同期関数を実行 -> その戻り値 Promiseが持つ catch()メソッドを使って、エラーが起きた場合はnext()にエラーを渡す
