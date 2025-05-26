import { Track } from "../types/trackType";
import { RecommendedTrackItem } from "./RecommendedTrackItem";

type Props = {
  tracks: Track[];
  isSaved: boolean;
  likedTrackIds: number[];
  expandedTrackId: number | null;
  onToggleLike: (id: number) => void;
  onToggleExpand: (id: number) => void;
};

export const RecommendedTrackList = ({
  tracks,
  isSaved,
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
          isSaved={isSaved}
          isLiked={likedTrackIds.includes(track.id)} // いいねされているか
          isExpanded={expandedTrackId === track.id} // 展開されているか
          onToggleLike={onToggleLike}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </ul>
  );
};
