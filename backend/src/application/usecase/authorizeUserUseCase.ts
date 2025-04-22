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

    // SoundCloud の /me エンドポイントでユーザー情報取得

    // DB にてユーザー存在チェック

    // 存在しなければ新規登録

    // セッションIDを発行
    const sessionId = uuidv4();

    // redisに保存
    const sessionData = {
      userId: ,
      accessToken: ,
      refreshToken: , 
      accessTokenExpiresAt: ,
      createdAt: ,
    }
  
    await this._sessionRepository.save(sessionId, sessionData);

    // セッション ID を Cookie にセットしフロントへ返却
  }
}
