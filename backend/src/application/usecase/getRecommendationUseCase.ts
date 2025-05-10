import { TokenApplicationService } from "../applicationSercices/tokenApplicationService";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";
import { RecommendationDomainService } from "../../domain/domainServices/recommendationDomainService";
import { Followings } from "../../domain/valueObjects/followings";
import { TrackInfo } from "../../domain/valueObjects/trackInfo";
import { RecommendationApplicationService } from "../applicationSercices/recommendationApplicationService";

export class GetRecommendationUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService,
    private readonly _userApiRepository: UserApiRepository,
    private readonly _recommendationDomainService: RecommendationDomainService,
    private readonly _recommendationApplicationService: RecommendationApplicationService,
    private readonly _recommendationDbRepository: RecommendationDbRepository
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

    //　フォロー中のアーティストを VO に変換
    const followings = new Followings(rawFollowings);

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

    ////////　ここまで実装完了///////

    // 取得した楽曲からレコメンド作成 （Recommendation エンティティに変換（レコメンドIDなども付与））
    const recommendation =
      this._recommendationDomainService.createRecommendation(tracks); // Recommendationの構築が複雑であればFactoryを導入する

    // レコメンド結果をDBに保存
    await this._recommendationDbRepository.save(recommendation);

    // レコメンド結果をコントローラーに返す
    return recommendation; // DTOしてコントローラーに返す
  }
}
