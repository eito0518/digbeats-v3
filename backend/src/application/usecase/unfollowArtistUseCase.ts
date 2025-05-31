import { TokenApplicationService } from "../applicationServices/tokenApplicationService";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";

export class UnfollowArtistUseCase {
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
    await this._userApiRepository.unfollowArtist(
      validToken.accessToken,
      soundcloudArtistId
    );
  }
}
