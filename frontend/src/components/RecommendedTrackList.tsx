import { Track } from "../types/trackType";
import { RecommendedTrackItem } from "./RecommendedTrackItem";

type Props = {
  tracks: Track[];
  recommendationId: number;
  expandedTrackId: number | null;
  onToggleLike: (
    trackId: number,
    recommendationId: number,
    isCurrentlyLiked: boolean
  ) => void;
  onToggleExpandTrack: (trackId: number) => void;
};

export const RecommendedTrackList = ({
  tracks,
  recommendationId,
  expandedTrackId,
  onToggleLike,
  onToggleExpandTrack,
}: Props) => {
  return (
    // レコメンドを表示
    <ul className="grid grid-cols-1 gap-4">
      {tracks.map((track) => (
        <RecommendedTrackItem
          key={track.id}
          track={track}
          recommendationId={recommendationId}
          isLiked={track.isLiked} // いいねされているか
          isExpanded={expandedTrackId === track.id} // 展開されているか
          onToggleLike={onToggleLike}
          onToggleExpandTrack={onToggleExpandTrack}
        />
      ))}
    </ul>
  );
};
