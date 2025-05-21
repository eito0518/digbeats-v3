import { ArtistController } from "../controller/artistController";
import { SearchArtistsUseCase } from "../../application/usecase/searchArtistsUseCase";
import { TokenApplicationService } from "../../application/applicationServices/tokenApplicationService";
import { SessionRedisRepository } from "../../infrastructure/redis/sessionRedisRepository";
import { TokenSoundCloudRepository } from "../../infrastructure/api/tokenSoundCloudRepository";
import { ArtistSoundCloudRepository } from "../../infrastructure/api/artistSoundCloudRepository";

export const artistController = new ArtistController(
  new SearchArtistsUseCase(
    new TokenApplicationService(
      new SessionRedisRepository(),
      new TokenSoundCloudRepository()
    ),
    new ArtistSoundCloudRepository()
  )
);
