import { v4 as uuidv4 } from "uuid";
import { SessionRepository } from "../../domain/interfaces/sessionRepository";
import { SoundCloudApi } from "../../infrastructure/api/soundCloudApi";

export class AuthorizeUserUseCase {
  constructor(
    private _soundCloudApi: SoundCloudApi,
    private _sessionRepository: SessionRepository
  ) {}

  async run(code: string, codeVerifier: string) {
    // アクセストークンを取得
    const token = await this._soundCloudApi.GetToken(code, codeVerifier);
    // セッションIDを発行
    const sessionId = uuidv4();
    // はじめてのログインだったらDBにuserIdを作成

    // ２回目以降のログインだったら,userIdを探す

    // redisに保存
    const sessionData = {
      userId: ,
      accessToken: ,
      refreshToken: , 
      accessTokenExpiresAt: ,
      createdAt: ,
    }
  
    await this._sessionRepository.save(sessionId, sessionData);

    // セッションIDをCookieに保存
  }
}
