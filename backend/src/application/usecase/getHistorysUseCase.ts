import { SessionRepository } from "../../domain/interfaces/sessionRepository";
import { HistoryRepository } from "../../domain/interfaces/historyRepository";

export class GetHistorysUseCase {
  constructor(
    private readonly _sessionRepository: SessionRepository,
    private readonly _historyRepository: HistoryRepository
  ) {}

  async run(sessionId: string) {
    // セッションを取得
    const session = await this._sessionRepository.get(sessionId);

    // セッションからユーザーIDを取得
    const userId = session.userId;

    // レコメンド履歴を取得
    const historys = await this._historyRepository.get(userId, 20);

    // レコメンド履歴をコントローラーに返す
    return historys;
  }
}
