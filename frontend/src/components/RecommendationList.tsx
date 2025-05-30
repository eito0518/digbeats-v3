import { Recommendation } from "../types/recommendationType";
import { RecommendedTrackList } from "./RecommendedTrackList";

type Props = {
  recommendations: Recommendation[];
  animatedId: number | null;
  likedTrackIds: number[];
  expandedTrackId: number | null;
  onToggleLike: (trackId: number, recommendationId: number) => void;
  onToggleExpandTrack: (trackId: number) => void;
};

export const RecommendationList = ({
  recommendations,
  animatedId,
  likedTrackIds,
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
            className={`transition-all duration-700 rounded-xl px-2 py-1 ${
              recommendation.recommendationId === animatedId
                ? "bg-yellow-500/10 animate-pulse"
                : ""
            }`}
          >
            <p className="text-sm text-gray-400">
              {new Date(recommendation.recommendedAt).toLocaleDateString()}
            </p>
            <RecommendedTrackList
              key={recommendation.recommendationId}
              tracks={recommendation.tracks}
              recommendationId={recommendation.recommendationId}
              likedTrackIds={likedTrackIds}
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
