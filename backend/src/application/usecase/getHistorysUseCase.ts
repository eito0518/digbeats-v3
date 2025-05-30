import { SessionRepository } from "../../domain/interfaces/sessionRepository";
import { HistoryDbRepository } from "../../domain/interfaces/historyDbRepository";

export class GetHistorysUseCase {
  constructor(
    private readonly _sessionRepository: SessionRepository,
    private readonly _historyDbRepository: HistoryDbRepository
  ) {}

  async run(sessionId: string) {
    // セッションを取得
    const session = await this._sessionRepository.get(sessionId);

    // セッションからユーザーIDを取得
    const userId = session.userId;

    // レコメンド履歴を取得
    const histories = await this._historyDbRepository.get(userId, 20);

    // レコメンド履歴をコントローラーに返す
    return histories;
  }
}
