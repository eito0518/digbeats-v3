import { Recommendation } from "../entities/recommendation";

export interface HistoryDbRepository {
  get(userId: number): Promise<Recommendation[]>;
}
