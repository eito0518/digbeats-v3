import { Recommendation } from "../types/recommendationType";
import { RecommendedTrackList } from "./RecommendedTrackList";

type Props = {
  recommendations: Recommendation[];
  animatedId: number | null;
  expandedTrackId: number | null;
  onToggleLike: (
    trackId: number,
    recommendationId: number,
    isCurrentlyLiked: boolean
  ) => void;
  onToggleExpandTrack: (trackId: number) => void;
};

export const RecommendationList = ({
  recommendations,
  animatedId,
  expandedTrackId,
  onToggleLike,
  onToggleExpandTrack,
}: Props) => {
  return (
    // レコメンド一覧を表示
    <ul className="grid grid-cols-1 gap-4">
      {recommendations.map((recommendation) => {
        return (
          <div
            key={recommendation.recommendationId}
            className={`rounded-xl px-2 py-1 transition-colors duration-2000 ${
              recommendation.recommendationId === animatedId
                ? "bg-orange-400"
                : "bg-transparent"
            }`}
          >
            <p className="text-sm text-gray-400">
              {new Date(recommendation.recommendedAt).toLocaleDateString()}
            </p>
            <RecommendedTrackList
              key={recommendation.recommendationId}
              tracks={recommendation.tracks}
              recommendationId={recommendation.recommendationId}
              expandedTrackId={expandedTrackId}
              onToggleLike={onToggleLike}
              onToggleExpandTrack={onToggleExpandTrack}
            />
          </div>
        );
      })}
    </ul>
  );
};
