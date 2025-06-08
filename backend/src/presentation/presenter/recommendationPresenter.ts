import { Recommendation } from "../../domain/entities/recommendation";
import { TrackPresenter } from "./trackPresenter";

export class RecommendationPresenter {
  private static formatRecommendation(recommendation: Recommendation) {
    return {
      recommendationId: recommendation.id,
      recommendedAt: recommendation.createdAt,
      tracks: recommendation.tracks.map((track) => TrackPresenter.toDTO(track)),
    };
  }

  static toDTO(recommendation: Recommendation) {
    return {
      recommendation: this.formatRecommendation(recommendation),
    };
  }

  static toDTOList(recommendations: Recommendation[]) {
    return {
      recommendations: recommendations.map((recommendation) =>
        this.formatRecommendation(recommendation)
      ),
    };
  }
}
