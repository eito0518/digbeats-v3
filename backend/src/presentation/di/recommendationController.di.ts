import { RecommendationController } from "../controller/recommendationController";
import { GetRecommendationUseCase } from "../../application/usecase/getRecommendationUseCase";
import { TokenApplicationService } from "../../application/applicationServices/tokenApplicationService";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";
import { UserSoundCloudRepository } from "../../infrastructure/api/userSoundCloudRepository";
import { RecommendationDomainService } from "../../domain/domainServices/recommendationDomainService";
import { RecommendationApplicationService } from "../../application/applicationServices/recommendationApplicationService";
import { TrackSoundCloudRepository } from "../../infrastructure/api/trackSoundCloudRepository";
import { RecommendationMySQLRepository } from "../../infrastructure/db/recommendationMySQLRepository";
import { ArtistMysqlRepository } from "../../infrastructure/db/artistMysqlRepository";
import { TrackMysqlRepository } from "../../infrastructure/db/tracksMysqlRepository";
import { GetHistorysUseCase } from "../../application/usecase/getHistorysUseCase";
import { HistoryMysqlRepository } from "../../infrastructure/db/historyMysqlRepository";
import { LikeTracksUseCase } from "../../application/usecase/likeTracksUseCase";
import { LikeSoundCloudRepository } from "../../infrastructure/api/likeSoundCloudRepository";
import { LikeMysqlRepository } from "../../infrastructure/db/likeMysqlRepository";
import Redis from "ioredis";
import { GetTodayRecommendationsUseCase } from "../../application/usecase/getTodayRecommendationsUseCase";
import { TodayRecommendationMysqlRepository } from "../../infrastructure/db/todayRecommendationMysqlRepository";

export const recommendationController = new RecommendationController(
  // レコメンドを取得
  new GetRecommendationUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
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
  // 「今日のレコメンド」を取得
  new GetTodayRecommendationsUseCase(
    new SessionRedisRepository(new Redis()),
    new TodayRecommendationMysqlRepository()
  ),
  // レコメンド履歴を取得
  new GetHistorysUseCase(
    new SessionRedisRepository(new Redis()),
    new HistoryMysqlRepository()
  ),
  // レコメンド楽曲をいいね
  new LikeTracksUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
      new TokenSoundCloudRepository()
    ),
    new TrackMysqlRepository(),
    new LikeSoundCloudRepository(),
    new LikeMysqlRepository()
  )
);
