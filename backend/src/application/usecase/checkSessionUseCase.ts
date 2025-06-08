import { SessionRepository } from "../../domain/interfaces/sessionRepository";

export class CheckSessionUseCase {
  constructor(private readonly _sessionRepository: SessionRepository) {}

  async run(sessionId: string) {
    // セッションを取得
    const session = await this._sessionRepository.get(sessionId);
  }
}
