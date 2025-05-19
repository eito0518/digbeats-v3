import { RecommendationController } from "../controller/recommendationController";
import { GetRecommendationUseCase } from "../../application/usecase/getRecommendationUseCase";
import { TokenApplicationService } from "../../application/applicationSercices/tokenApplicationService";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";
import { UserSoundCloudRepository } from "../../infrastructure/api/userSoundCloudRepository";
import { RecommendationDomainService } from "../../domain/domainServices/recommendationDomainService";
import { RecommendationApplicationService } from "../../application/applicationSercices/recommendationApplicationService";
import { TrackSoundCloudRepository } from "../../infrastructure/api/trackSoundCloudRepository";
import { RecommendationMySQLRepository } from "../../infrastructure/db/recommendationMySQLRepository";
import { ArtistMysqlRepository } from "../../infrastructure/db/artistMysqlRepository";
import { TrackMysqlRepository } from "../../infrastructure/db/tracksMysqlRepository";
import { GetHistorysUseCase } from "../../application/usecase/getHistorysUseCase";
import { HistoryMysqlRepository } from "../../infrastructure/db/historyMysqlRepository";
import { LikeTracksUseCase } from "../../application/usecase/likeTracksUseCase";
import { LikeSoundCloudRepository } from "../../infrastructure/api/likeSoundCloudRepository";
import { LikeMysqlRepository } from "../../infrastructure/db/likeMysqlRepository";

export const recommendationController = new RecommendationController(
  // レコメンド取得
  new GetRecommendationUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository(),
    new RecommendationDomainService(),
    new RecommendationApplicationService(new TrackSoundCloudRepository()),
    new RecommendationMySQLRepository(
      new ArtistMysqlRepository(),
      new TrackMysqlRepository()
    )
  ),
  // レコメンド履歴取得
  new GetHistorysUseCase(
    new SessionRedisRepository(),
    new HistoryMysqlRepository()
  ),
  // レコメンド楽曲をいいね
  new LikeTracksUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(),
      new TokenSoundCloudRepository()
    ),
    new TrackMysqlRepository(),
    new LikeSoundCloudRepository(),
    new LikeMysqlRepository()
  )
);
