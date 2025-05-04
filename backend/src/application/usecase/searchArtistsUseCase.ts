import { TokenApplicationService } from "../applicationSercices/tokenApplicationService";
import { ArtistApiRepository } from "../../domain/interfaces/artistApiRepository";

export class SearchArtistsUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService,
    private readonly _artistApiRepository: ArtistApiRepository
  ) {}

  async run(sessionId: string, artistName: string) {
    // 有効なトークンを取得
    const validToken = await this._tokenApplicationService.getValidTokenOrThrow(
      sessionId
    );

    //　APIでアーティストを検索
    const artists = await this._artistApiRepository.searchArtist(
      validToken.accessToken,
      artistName
    );

    // 検索結果 を コントローラーに返す
    return artists;
  }
}
