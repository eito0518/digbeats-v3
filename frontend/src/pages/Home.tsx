import { useState } from "react";
import { RecommendationResponse } from "../types/recommendation";
import axios from "axios";
import logo from "../assets/digbeats-logo-transparent.png";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";

import { dummyRecommendation } from "../dummyData";

export const Home = () => {
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [likedTrackIds, setLikedTrackIds] = useState<number[]>([]);
  const [expandedTrackId, setExpandedTrackId] = useState<number | null>(null); // 展開するのは１つだけ

  // レコメンドを生成
  const handleGenerateRecommendation = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/recommendations`
      );
      setRecommendation(response.data);
      return;
    } catch (error) {
      console.error("failed to genarate recommendation ", error);
      throw new Error("Failed to genarate recommendation");
    }
  };

  // いいね状態を切り替え
  const toggleLike = (trackId: number) => {
    setLikedTrackIds(
      (previous) =>
        previous.includes(trackId)
          ? previous.filter((id) => id !== trackId) // 取り除く　（いいね解除）
          : [...previous, trackId] // 追加する (いいねする)
    );
  };

  // 展開するトラックを切り替え
  const toggleExpand = (trackId: number) => {
    setExpandedTrackId(
      (previous) =>
        previous === trackId
          ? null // すでに展開されていたら閉じる
          : trackId // 別のtrackを展開したら、そのtrackのIDに切り替える
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ロゴ ＋ 検索バー ＋ プロフィールアイコン */}
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 pt-6">
        {/* ロゴ を左側に表示 */}
        <img
          src={logo}
          alt="DigBeats Logo"
          className="w-15 h-15 object-contain"
        />
        {/* 検索バー + プロフィールアイコン を右側に表示*/}
        <div className="flex items-center gap-2 w-[340px]">
          <input
            type="text"
            placeholder="🔍  Who is your favorite artist?"
            className="bg-neutral-900 text-white px-4 py-3 rounded-full w-full placeholder-gray-400"
            disabled
          />
          <button className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center aspect-square">
            👤
          </button>
        </div>
      </div>

      {/* レコメンドボタン */}
      <div className="z-10 flex justify-center w-full mt-20 sm:mt-16 mb-20 sm:mb-12">
        <button
          className="bg-white text-black font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition"
          onClick={handleGenerateRecommendation}
        >
          Generate Recommendation
        </button>
      </div>

      {/* 今日のレコメンド */}
      {dummyRecommendation && (
        <div className="px-4 max-w-screen-lg mx-auto pb-12">
          <h2 className="text-lg font-semibold mb-4">Today’s Recommendation</h2>
          <ul className="grid grid-cols-1 gap-4">
            {dummyRecommendation.tracks.map((track: any) => (
              <li
                key={track.id}
                className={`flex flex-col bg-neutral-900 rounded-xl px-4 py-3 gap-2 transition-all duration-300 ${
                  expandedTrackId === track.id ? "pb-6" : ""
                }`}
              >
                {/* トラック　（クリックで展開） */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => toggleExpand(track.id)}
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
                    onClick={(e) => {
                      e.stopPropagation(); // 親のonClickの発火を防ぐ
                      toggleLike(track.id);
                    }}
                  >
                    {likedTrackIds.includes(track.id) ? (
                      <FavoriteIcon sx={{ color: "orange" }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </div>

                {/* 展開中のウィジェット */}
                {expandedTrackId === track.id && (
                  <div className="w-full mt-4">
                    <iframe
                      width="100%"
                      height="166"
                      allow="autoplay"
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                        track.permalinkUrl
                      )}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false`}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
