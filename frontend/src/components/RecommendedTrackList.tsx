import { Track } from "../types/trackType";
import { RecommendedTrackItem } from "./RecommendedTrackItem";

type Props = {
  tracks: Track[];
  recommendationId: number;
  likedTrackIds: number[];
  expandedTrackId: number | null;
  onToggleLike: (trackId: number, recommendationId: number) => void;
  onToggleExpand: (trackId: number) => void;
};

export const RecommendedTrackList = ({
  tracks,
  recommendationId,
  likedTrackIds,
  expandedTrackId,
  onToggleLike,
  onToggleExpand,
}: Props) => {
  return (
    // レコメンドを表示
    <ul className="grid grid-cols-1 gap-4">
      {tracks.map((track) => (
        <RecommendedTrackItem
          key={track.id}
          track={track}
          recommendationId={recommendationId}
          isLiked={likedTrackIds.includes(track.id)} // いいねされているか
          isExpanded={expandedTrackId === track.id} // 展開されているか
          onToggleLike={onToggleLike}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </ul>
  );
};
