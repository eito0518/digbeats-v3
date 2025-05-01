import { SessionRepository } from "../../domain/interfaces/sessionRepository";
import { TokenRepository } from "../../domain/interfaces/tokenRepository";
import { Session } from "../../domain/valueObjects/session";
import { Token } from "../../domain/valueObjects/token";

export class TokenApplicationService {
  constructor(
    private readonly _sessionRepository: SessionRepository,
    private readonly _tokenRepository: TokenRepository
  ) {}

  // ユーザーの有効なトークンを取得 or ユーザーに再ログインさせる
  async getValidTokenOrThrow(sessionId: string | null): Promise<Token> {
    // sessionId がなければ再ログインを要求
    if (!sessionId) throw new Error("REAUTH_REQUIRED");

    // セッションを取得
    const session = await this._sessionRepository.get(sessionId);

    // セッションが期限切れならば再ログインを要求
    if (!session) {
      throw new Error("REAUTH_REQUIRED");
    }

    let token = session.token;

    // アクセストークンが期限切れならば
    if (token.isAccessTokenExpired()) {
      // リフレッシュトークンで更新
      token = await this._tokenRepository.refresh(token.refreshToken);
    }

    // セッションを更新
    await this._sessionRepository.save(
      sessionId,
      new Session(session.userId, token, Date.now())
    );

    // 有効なトークンを返す
    return session.token;
  }
}
