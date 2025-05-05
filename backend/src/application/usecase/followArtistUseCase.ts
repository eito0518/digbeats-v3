import { UserApiRepository } from "../../domain/interfaces/userApiRepository";
import { TokenApplicationService } from "../applicationSercices/tokenApplicationService";

export class FollowArtistUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService,
    private readonly _userApiRepository: UserApiRepository
  ) {}

  async run(sessionId: string, soundcloudArtistId: number): Promise<void> {
    // 有効なトークンを取得
    const validToken = await this._tokenApplicationService.getValidTokenOrThrow(
      sessionId
    );

    // APIでアーティストをフォロー
    await this._userApiRepository.followArtist(
      validToken.accessToken,
      soundcloudArtistId
    );
  }
}
