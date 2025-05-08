import { Request, Response } from "express";

export class RecommendationController {
  constructor() {}

  // レコメンドを取得する
  async getRecommendations(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // ユースケース

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({});
  }
}
