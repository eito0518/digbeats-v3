import { UserController } from "../controller/userController";
import { FetchMyUserInfoUseCase } from "../../application/usecase/fetchMyUserInfoUseCase";
import { FetchMyFollowingsUseCase } from "../../application/usecase/fetchMyFollowingsUseCase";
import { FollowArtistUseCase } from "../../application/usecase/followArtistUseCase";
import { TokenApplicationService } from "../../application/applicationServices/tokenApplicationService";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";
import Redis from "ioredis";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";
import { UserSoundCloudRepository } from "../../infrastructure/api/userSoundCloudRepository";

export const userController = new UserController(
  new FetchMyUserInfoUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository()
  ),
  new FetchMyFollowingsUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository()
  ),
  new FollowArtistUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository()
  )
);
