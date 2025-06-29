import { TokenApplicationService } from "../applicationServices/tokenApplicationService";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";
import { RecommendationDomainService } from "../../domain/domainServices/recommendationDomainService";
import { RecommendationApplicationService } from "../applicationServices/recommendationApplicationService";
import { RecommendationRepository } from "../../domain/interfaces/recommendationDbRepository";
import { Followings } from "../../domain/valueObjects/followings";
import { Recommendation } from "../../domain/entities/recommendation";

export class GetRecommendationUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService,
    private readonly _userApiRepository: UserApiRepository,
    private readonly _recommendationDomainService: RecommendationDomainService,
    private readonly _recommendationApplicationService: RecommendationApplicationService,
    private readonly _recommendationDbRepository: RecommendationRepository
  ) {}

  async run(sessionId: string) {
    // 有効なトークンを取得
    const validToken = await this._tokenApplicationService.getValidTokenOrThrow(
      sessionId
    );

    //　APIでフォロー中のアーティストを取得
    const rawFollowings = await this._userApiRepository.fetchFollowings(
      validToken.accessToken
    );

    //　ArtistInfo[]型　から　VO(Followings型) に変換
    const followings = new Followings(rawFollowings);

    // レコメンド生成の条件を検証
    followings.validateRecommendation();

    // レコメンドのソースとなるアーティストを選ぶ
    const sourceArtist =
      this._recommendationDomainService.pickSourceArtist(followings);

    // 選ばれたアーティストから いいね楽曲　をランダムに　10曲選び、取得
    const tracks =
      await this._recommendationApplicationService.fetchAndPickLikedTracks(
        validToken.accessToken,
        sourceArtist,
        10
      );

    // 取得した楽曲からレコメンド(VO)を作成
    const userId = await this._tokenApplicationService.getUserId(sessionId);
    const recommendation = new Recommendation(userId, tracks);

    // レコメンドをDBに保存 (レコメンドID,作成日時を付与)
    const recommendationEntity =
      await this._recommendationDbRepository.saveAndReturnWithId(
        recommendation
      );

    // レコメンドをコントローラーに返す
    return recommendationEntity;
  }
}
