import { v4 as uuidv4 } from "uuid";
import { TokenRepository } from "../../domain/interfaces/tokenRepository";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";
import { UserDbRepository } from "../../domain/interfaces/userDbRepository";
import { SessionRepository } from "../../domain/interfaces/sessionRepository";
import { TokenService } from "../../domain/services/tokenService";

export class AuthorizeUserUseCase {
  constructor(
    private _tokenRepository: TokenRepository,
    private _userApiRepository: UserApiRepository,
    private _userDbRepository: UserDbRepository,
    private _sessionRepository: SessionRepository
  ) {}

  async run(code: string, codeVerifier: string) {
    // アクセストークンを取得
    const token = await this._tokenRepository.getToken(code, codeVerifier);

    // SoundCloudからユーザー情報取得
    const user = await this._userApiRepository.getUser(token.accessToken);

    // DB から ユーザー情報 を取得
    const findUserResult = await this._userDbRepository.findUserByExternalId(
      user.soundCloudUserId
    );

    // DB に ユーザー情報 が登録されてなければ、新規登録
    const userId = findUserResult
      ? findUserResult.userId
      : (await this._userDbRepository.createUser(user.soundCloudUserId)).userId;

    // セッションIDを発行
    const sessionId = uuidv4();

    // redisに保存
    await this._sessionRepository.save(sessionId, {
      userId: userId, // データベースで 発行または取得　したもの
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      accessTokenExpiresAt: await TokenService.getAccessTokenExpiresAt(
        Number(token.expiresIn)
      ),
      createdAt: Date.now(),
    });

    // sessionId を コントローラーに返す
    return sessionId;
  }
}
