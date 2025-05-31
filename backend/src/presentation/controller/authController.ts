import { Request, Response } from "express";
import { AuthorizeUserUseCase } from "../../application/usecase/authorizeUserUseCase";
import { validateAuthParams } from "../utils/validation";

export class AuthController {
  constructor(private readonly _authorizeUserUseCase: AuthorizeUserUseCase) {}

  // ユーザーを認証する
  async authorizeUser(req: Request, res: Response): Promise<void> {
    // リクエスト
    const { code, codeVerifier } = req.body;

    // バリデーション
    if (!validateAuthParams(code, codeVerifier, res)) return;

    // ユースケース
    const sessionId = await this._authorizeUserUseCase.run(code, codeVerifier);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　CSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({
        message: "Authorize user request succeeded",
      });
  }
}
