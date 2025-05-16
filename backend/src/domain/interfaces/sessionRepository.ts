import { Session } from "../../domain/valueObjects/session";

export interface SessionRepository {
  save(sessionId: string, session: Session): Promise<void>;
  get(sessionId: string): Promise<Session>;
}
