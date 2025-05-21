import { TokenApplicationService } from "../applicationServices/tokenApplicationService";
import { TrackDbRepository } from "../../domain/interfaces/trackDbRepository";
import { LikeApiRepository } from "../../domain/interfaces/likeApiRepository";
import { LikeDbRepository } from "../../domain/interfaces/likeDbRepository";

export class LikeTracksUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService,
    private readonly _trackDbRepository: TrackDbRepository,
    private readonly _likeApiRepository: LikeApiRepository,
    private readonly _likeDbRepository: LikeDbRepository
  ) {}

  async run(
    sessionId: string,
    recommendationId: number,
    trackIds: number[]
  ): Promise<void> {
    // 有効なトークンを取得
    const validToken = await this._tokenApplicationService.getValidTokenOrThrow(
      sessionId
    );

    // いいね楽曲の外部IDを取得
    const externalTrackIds: number[] = await Promise.all(
      trackIds.map(
        async (trackId) =>
          await this._trackDbRepository.getExternalTrackId(trackId)
      )
    );

    // APIで対象の楽曲をいいね
    await Promise.all(
      externalTrackIds.map(
        async (externalTrackId) =>
          await this._likeApiRepository.likeTrack(
            validToken.accessToken,
            externalTrackId
          )
      )
    );

    // DBにいいねを記録
    await Promise.all(
      trackIds.map(
        async (trackId) =>
          await this._likeDbRepository.save(recommendationId, trackId)
      )
    );
  }
}
