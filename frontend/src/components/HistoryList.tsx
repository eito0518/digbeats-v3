import { Recommendation } from "../types/recommendationType";
import { RecommendedTrackList } from "./RecommendedTrackList";

type Props = {
  recommendations: Recommendation[];
  expandedRecommendationId: number | null;
  likedTrackIds: number[];
  expandedTrackId: number | null;
  onToggleExpandRecommendation: (recommendationId: number) => void;
  onToggleLike: (trackId: number, recommendationId: number) => void;
  onToggleExpandTrack: (trackId: number) => void;
};

export const HistoryList = ({
  recommendations,
  expandedRecommendationId,
  likedTrackIds,
  expandedTrackId,
  onToggleExpandRecommendation,
  onToggleLike,
  onToggleExpandTrack,
}: Props) => {
  return (
    <>
      {recommendations.length === 0 ? (
        <p className="text-sm text-gray-400">No recommendations yet.</p>
      ) : (
        // レコメンド履歴を一覧表示
        <ul className="grid grid-cols-1 gap-4">
          {recommendations.map((recommendation) => (
            <li
              key={recommendation.recommendationId}
              className="bg-neutral-800 rounded-xl px-4 py-3 cursor-pointer hover:bg-neutral-700 transition"
              onClick={() =>
                onToggleExpandRecommendation(recommendation.recommendationId)
              }
            >
              {/* レコメンドを生成した日付 */}
              <p className="text-sm text-gray-400">
                {new Date(recommendation.recommendedAt).toLocaleDateString()}
              </p>

              {/* 展開中のレコメンド　（トラック一覧） */}
              {expandedRecommendationId === recommendation.recommendationId && (
                <div className="mt-4">
                  <RecommendedTrackList
                    tracks={recommendation.tracks}
                    recommendationId={recommendation.recommendationId}
                    likedTrackIds={likedTrackIds}
                    expandedTrackId={expandedTrackId}
                    onToggleLike={onToggleLike}
                    onToggleExpandTrack={onToggleExpandTrack}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
