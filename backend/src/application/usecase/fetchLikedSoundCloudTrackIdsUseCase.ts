import { TokenApplicationService } from "../applicationServices/tokenApplicationService";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";

export class FetchLikedSoundCloudTrackIdsUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService,
    private readonly _userApiRepository: UserApiRepository
  ) {}

  async run(sessionId: string): Promise<number[]> {
    // 有効なトークンを取得
    const validToken = await this._tokenApplicationService.getValidTokenOrThrow(
      sessionId
    );

    //　APIでいいねした楽曲の SoundCloudId を取得
    const likedSoundCloudTrackIds =
      await this._userApiRepository.fetchLikedSoundCloudTrackIds(
        validToken.accessToken,
        20 // 最大２０ページ楽曲を取得　（50曲　× 20ページ = 最大1000曲）
      );

    // いいねした楽曲の SoundCloudId をコントローラーに返す
    return likedSoundCloudTrackIds;
  }
}
