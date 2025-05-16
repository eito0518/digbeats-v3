import { Recommendation } from "../entities/recommendation";

export interface RecommendationRepository {
  saveAndReturnWithId(recommendation: Recommendation): Promise<Recommendation>;
}
