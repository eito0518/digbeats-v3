import { Recommendation } from "../entities/recommendation";

export interface TodayRecommendationDbRepository {
  get(userId: number): Promise<Recommendation[]>;
}
