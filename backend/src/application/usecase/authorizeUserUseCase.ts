import { TokenRepository } from "../../domain/interfaces/tokenRepository";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";
import { UserDbRepository } from "../../domain/interfaces/userDbRepository";
import { SessionRepository } from "../../domain/interfaces/sessionRepository";
import { v4 as uuidv4 } from "uuid";
import { Session } from "../../domain/valueObjects/session";

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

    // 外部 から ユーザー情報 を取得
    const userInfo = await this._userApiRepository.fetchUser(token.accessToken);

    // DB から ユーザー を取得
    const findUserIdResult =
      await this._userDbRepository.findUserIdByExternalId(
        userInfo.externalUserId
      );

    // DB に ユーザー が登録されてなければ、新規登録
    const userId = findUserIdResult
      ? findUserIdResult
      : await this._userDbRepository.createUser(userInfo.externalUserId);

    // セッションIDを発行
    const sessionId = uuidv4();

    // セッションを保存
    await this._sessionRepository.save(
      sessionId,
      new Session(userId, token, Date.now())
    );

    // sessionId を コントローラーに返す
    return sessionId;
  }
}
