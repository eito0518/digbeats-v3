import { TokenApplicationService } from "../applicationSercices/tokenApplicationService";

export class FetchMyFollowingsUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService
  ) {}

  async run(sessionId: string) {
    // 有効なトークンを取得
    const validToken = await this._tokenApplicationService.getValidTokenOrThrow(
      sessionId
    );

    //　TODO: SoundCloudAPIでフォロー中のアーティストを取得
  }
}
