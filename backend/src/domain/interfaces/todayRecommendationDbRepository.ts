import { Recommendation } from "../entities/recommendation";

export interface TodayRecommendationDbRepository {
  get(userId: number, limit: number): Promise<Recommendation[]>;
}
