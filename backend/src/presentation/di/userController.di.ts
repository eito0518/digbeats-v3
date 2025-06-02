import { UserController } from "../controller/userController";
import { FetchMyUserInfoUseCase } from "../../application/usecase/fetchMyUserInfoUseCase";
import { FetchMyFollowingsUseCase } from "../../application/usecase/fetchMyFollowingsUseCase";
import { FollowArtistUseCase } from "../../application/usecase/followArtistUseCase";
import { UnfollowArtistUseCase } from "../../application/usecase/unfollowArtistUseCase";
import { FetchLikedSoundCloudTrackIdsUseCase } from "../../application/usecase/fetchLikedSoundCloudTrackIdsUseCase";
import { TokenApplicationService } from "../../application/applicationServices/tokenApplicationService";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";
import Redis from "ioredis";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";
import { UserSoundCloudRepository } from "../../infrastructure/api/userSoundCloudRepository";

export const userController = new UserController(
  // 自分のユーザー情報を取得
  new FetchMyUserInfoUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository()
  ),
  // フォロー中のアーティストを取得
  new FetchMyFollowingsUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository()
  ),
  // アーティストをフォロー
  new FollowArtistUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository()
  ),
  // アーティストのフォローを解除
  new UnfollowArtistUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository()
  ),
  // 自分のいいね楽曲のSoundCloudIdを取得
  new FetchLikedSoundCloudTrackIdsUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(new Redis()),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository()
  )
);
