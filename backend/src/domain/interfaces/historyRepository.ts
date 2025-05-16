import { RecommendationRecord } from "../entities/recommendationRecord";

export interface HistoryRepository {
  get(userId: number, limit: number): Promise<RecommendationRecord[]>;
}
