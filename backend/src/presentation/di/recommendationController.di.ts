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

export const recommendationController = new RecommendationController(
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
  )
);
