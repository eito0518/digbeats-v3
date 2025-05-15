import { Recommendation } from "../entities/recommendation";

export interface RecommendationDbRepository {
  saveAndReturnWithId(recommendation: Recommendation): Promise<Recommendation>;
}
