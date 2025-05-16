import { TokenApplicationService } from "../applicationSercices/tokenApplicationService";

export class GetRecommendationHistorysUseCase {
  constructor(
    private readonly _tokenApplicationService: TokenApplicationService
  ) {}

  async run(sessionId: string) {
    // ユーザーIDを取得

    // レコメンド履歴を取得

    // レコメンド履歴をコントローラーに返す
    return historys;
  }
}
