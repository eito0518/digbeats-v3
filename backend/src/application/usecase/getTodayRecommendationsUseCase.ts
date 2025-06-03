import { SessionRepository } from "../../domain/interfaces/sessionRepository";
import { TodayRecommendationDbRepository } from "../../domain/interfaces/todayRecommendationDbRepository";

export class GetTodayRecommendationsUseCase {
  constructor(
    private readonly _sessionRepository: SessionRepository,
    private readonly _todayRecommendationDbRepository: TodayRecommendationDbRepository
  ) {}

  async run(sessionId: string) {
    // セッションを取得
    const session = await this._sessionRepository.get(sessionId);

    // セッションからユーザーIDを取得
    const userId = session.userId;

    // 今日のレコメンドを最大３件取得
    const todayRecommendations =
      await this._todayRecommendationDbRepository.get(userId, 3);

    // 今日のレコメンドをコントローラーに返す
    return todayRecommendations;
  }
}
