import { TokenApplicationService } from "../applicationServices/tokenApplicationService";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";

export class FetchMyFollowingsUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService,
    private readonly _userApiRepository: UserApiRepository
  ) {}

  async run(sessionId: string) {
    // 有効なトークンを取得
    const validToken = await this._tokenApplicationService.getValidTokenOrThrow(
      sessionId
    );

    //　APIでフォロー中のアーティストを取得
    const followings = await this._userApiRepository.fetchFollowings(
      validToken.accessToken
    );

    // アーティスト情報 を コントローラーに返す
    return followings;
  }
}
