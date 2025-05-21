import { UserController } from "../controller/userController";
import { FetchMyFollowingsUseCase } from "../../application/usecase/fetchMyFollowingsUseCase";
import { TokenApplicationService } from "../../application/applicationServices/tokenApplicationService";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";
import { UserSoundCloudRepository } from "../../infrastructure/api/userSoundCloudRepository";

export const userController = new UserController(
  new FetchMyFollowingsUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(),
      new TokenSoundCloudRepository()
    ),
    new UserSoundCloudRepository()
  )
);
