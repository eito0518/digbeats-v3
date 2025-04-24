import { v4 as uuidv4 } from "uuid";
import { TokenRepository } from "../../domain/interfaces/tokenRepository";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";
import { SessionRepository } from "../../domain/interfaces/sessionRepository";

export class AuthorizeUserUseCase {
  constructor(
    private _tokenRepository: TokenRepository,
    private _userRepository: UserApiRepository,
    private _sessionRepository: SessionRepository
  ) {}

  async run(code: string, codeVerifier: string) {
    // アクセストークンを取得
    const token = await this._tokenRepository.getToken(code, codeVerifier);

    // SoundCloud の /me エンドポイントでユーザー情報取得
    const user = await this._userRepository.getUser(token.accessToken);

    // DB にてユーザー存在チェック

    // 存在しなければ新規登録

    // セッションIDを発行
    const sessionId = uuidv4();

    // redisに保存
    await this._sessionRepository.save(sessionId, {
      userId: userId, // データベースで発行
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      accessTokenExpiresAt: expiresAt, // サービス層で計算して代入
      createdAt: Date.now(),
    });

    // セッション ID を Cookie にセットしフロントへ返却
  }
}
