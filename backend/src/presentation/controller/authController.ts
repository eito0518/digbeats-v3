import { Request, Response } from "express";
import { AuthorizeUserUseCase } from "../../application/usecase/authorizeUserUseCase";

export class AuthController {
  constructor(private readonly _authorizeUserUseCase: AuthorizeUserUseCase) {}

  // ユーザーを認証する
  async authorizeUser(req: Request, res: Response): Promise<void> {
    // リクエスト
    const { code, codeVerifier } = req.body;

    // ユースケース
    const sessionId = this._authorizeUserUseCase.run(code, codeVerifier);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　CSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({
        message: "authorize user request succeeded",
      });
  }
}
