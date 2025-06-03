import { TokenApplicationService } from "../applicationServices/tokenApplicationService";
import { TrackDbRepository } from "../../domain/interfaces/trackDbRepository";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";
import { UserDbRepository } from "../../domain/interfaces/userDbRepository";

export class LikeTrackUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService,
    private readonly _trackDbRepository: TrackDbRepository,
    private readonly _userApiRepository: UserApiRepository,
    private readonly _userDbRepository: UserDbRepository
  ) {}

  async run(
    sessionId: string,
    recommendationId: number,
    trackId: number
  ): Promise<void> {
    // 有効なトークンを取得
    const validToken = await this._tokenApplicationService.getValidTokenOrThrow(
      sessionId
    );

    // trackId から soundcloudTrackId を取得する
    const soundcloudTrackId = await this._trackDbRepository.getExternalTrackId(
      trackId
    );

    // APIで楽曲のいいねを登録
    await this._userApiRepository.likeTrack(
      validToken.accessToken,
      soundcloudTrackId
    );

    // DBに楽曲のいいねを登録
    await this._userDbRepository.likeTrack(recommendationId, trackId);
  }
}
