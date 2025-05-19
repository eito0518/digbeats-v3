import { RecommendationRecord } from "../entities/recommendationRecord";

export interface HistoryDbRepository {
  get(userId: number, limit: number): Promise<RecommendationRecord[]>;
}
