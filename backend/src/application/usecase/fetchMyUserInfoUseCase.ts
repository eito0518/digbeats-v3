import { TokenApplicationService } from "../applicationServices/tokenApplicationService";
import { UserApiRepository } from "../../domain/interfaces/userApiRepository";

export class FetchMyUserInfoUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService,
    private readonly _userApiRepository: UserApiRepository
  ) {}

  async run(sessionId: string) {
    // 有効なトークンを取得
    const validToken = await this._tokenApplicationService.getValidTokenOrThrow(
      sessionId
    );

    //　APIで自分のユーザー情報を取得
    const userInfo = await this._userApiRepository.fetchMyUserInfo(
      validToken.accessToken
    );

    // アーティスト情報 を コントローラーに返す
    return userInfo;
  }
}
