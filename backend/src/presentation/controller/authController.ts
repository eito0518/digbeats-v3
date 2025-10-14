import { Request, Response } from "express";
import { AuthorizeUserUseCase } from "../../application/usecase/authorizeUserUseCase";
import { CheckSessionUseCase } from "../../application/usecase/checkSessionUseCase";
import { validateAuthParams } from "../utils/validation";

export class AuthController {
  constructor(
    private readonly _authorizeUserUseCase: AuthorizeUserUseCase,
    private readonly _checkSessionUseCase: CheckSessionUseCase
  ) {}

  // ユーザーを認証する
  authorizeUser = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const { code, codeVerifier } = req.body;

    // バリデーション
    validateAuthParams(code, codeVerifier);

    // ユースケース
    const sessionId = await this._authorizeUserUseCase.run(code, codeVerifier);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        domain: ".digbeats.jp",
        sameSite: "lax",
      })
      .status(200)
      .json({
        message: "Authorize user request succeeded",
      });
  };

  // ログイン中かどうかを判定する
  checkSession = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // ユースケース
    await this._checkSessionUseCase.run(sessionId);

    // レスポンス
    res.status(200).json({ message: "OK" });
  };
}
