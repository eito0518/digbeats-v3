import { Track } from "../types/trackType";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

type Props = {
  track: Track;
  isSaved: boolean;
  isLiked: boolean;
  isExpanded: boolean;
  onToggleLike: (id: number) => void;
  onToggleExpand: (id: number) => void;
};

export const RecommendedTrackItem = ({
  track,
  isSaved,
  isLiked, // いいねされているか
  isExpanded, // 展開されているか
  onToggleLike,
  onToggleExpand,
}: Props) => {
  // レコメンドされたトラック
  return (
    <li
      className={`flex flex-col bg-neutral-900 rounded-xl px-4 py-3 gap-2 transition-all duration-300 ${
        isExpanded ? "pb-6" : "" // 展開の判定
      }`}
    >
      {/* トラック　（クリックで展開） */}
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => onToggleExpand(track.id)}
      >
        {/* アートワーク */}
        <img
          src={track.artworkUrl}
          alt={track.title}
          className="w-16 h-16 rounded-md object-cover"
        />
        {/* タイトル・アーティスト名 */}
        <div className="flex-1">
          <p className="font-semibold">{track.title}</p>
          <p className="text-sm text-gray-400">{track.artist.name}</p>
        </div>
        {/* いいねボタン */}
        <IconButton
          disabled={isSaved} // 保存済みの場合、ボタンは無効化
          onClick={(e) => {
            e.stopPropagation(); // 親のonClickの発火を防ぐ
            onToggleLike(track.id);
          }}
        >
          {isSaved ? (
            //　保存済み（DBから取得）の場合
            track.wasLiked ? ( // wasLikedで判定
              <StarIcon sx={{ color: "orange" }} />
            ) : (
              <StarBorderIcon sx={{ color: "gray" }} />
            )
          ) : // 今生成されたレコメンドの場合
          isLiked ? ( // isLikedで判定
            <FavoriteIcon sx={{ color: "orange" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "white" }} />
          )}
        </IconButton>
      </div>
      {/* 展開中のウィジェット */}
      {isExpanded && (
        <div className="w-full mt-4">
          <iframe
            width="100%"
            height="166"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
              track.permalinkUrl
            )}&color=%23ff5500&auto_play=false`}
          />
        </div>
      )}
    </li>
  );
};
