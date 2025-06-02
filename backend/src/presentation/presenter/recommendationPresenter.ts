import { Recommendation } from "../../domain/entities/recommendation";
import { TrackPresenter } from "./trackPresenter";

export class RecommendationPresenter {
  static toDTO(recommendation: Recommendation) {
    return {
      recommendationId: recommendation.id,
      recommendedAt: recommendation.createdAt,
      tracks: recommendation.tracks.map((track) => TrackPresenter.toDTO(track)),
    };
  }

  static toDTOList(recommendations: Recommendation[]) {
    return {
      recommendations: recommendations.map((recommendation) =>
        this.toDTO(recommendation)
      ),
    };
  }
}
