import { useEffect, useState } from "react";
import { RecommendationResponse } from "../types/recommendation";
import axios from "axios";
import logo from "../assets/digbeats-logo-transparent.png";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import IconButton from "@mui/material/IconButton";

import { dummyRecommendation } from "../dummyData";

export const Home = () => {
  const [isSaved, setIsSaved] = useState(false); // 「今日のレコメンド」 が保存済みかどうか
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [generateCount, setGenerateCount] = useState(0);
  const [likedTrackIds, setLikedTrackIds] = useState<number[]>([]);
  const [expandedTrackId, setExpandedTrackId] = useState<number | null>(null); // 展開するのは１つだけ

  // 「今日のレコメンド」 が保存済みか確認
  useEffect(() => {
    const fetchTodayRecommendation = async () => {
      try {
        const response = await axios.get("/api/recommendations/today", {
          withCredentials: true,
        });
        // 保存済みの場合
        if (response.data) {
          setRecommendation(response.data); // DBから取得したレコメンドをセット
          setIsSaved(true); // 保存済みとして記録
        }
      } catch (error) {
        console.error("failed to fetch today recommendation ", error);
        throw new Error("Failed to fetch today recommendation ");
      }
    };
    fetchTodayRecommendation();
  }, []); // ホーム画面マウント時に発火

  // レコメンドを生成
  const handleGenerateRecommendation = async () => {
    if (generateCount >= 3) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/recommendations`
      );
      setRecommendation(response.data); // 生成したレコメンドをセット
      setLikedTrackIds([]); // 生成時にいいね状態リセット
      setGenerateCount((previous) => previous + 1);
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

  // レコメンドを保存
  const handleSaveRecommendation = async () => {
    if (!recommendation) return;

    try {
      await axios.post(
        `/api/recommendations/${recommendation.recommendationId}/likes`,
        { likes: likedTrackIds },
        { withCredentials: true }
      );
      setIsSaved(true);
    } catch (error) {
      console.error("failed to save recommendation", error);
      alert("保存に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ロゴ ＋ 検索バー ＋ プロフィールアイコン */}
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 pt-6">
        {/* ロゴ */}
        <img
          src={logo}
          alt="DigBeats Logo"
          className="w-15 h-15 object-contain"
        />
        {/* 検索バー + プロフィールアイコン */}
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
      {isSaved ? (
        <div className="text-center text-gray-400 text-sm mt-16 mb-12">
          <p>You have already saved today’s recommendation.</p>
          <p>Come back tomorrow!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full mt-20 sm:mt-16 mb-20 sm:mb-12">
          {/* Generate / Refresh ボタン */}
          <button
            className="bg-white text-black font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition disabled:opacity-50"
            onClick={handleGenerateRecommendation}
            disabled={generateCount >= 3}
          >
            {generateCount === 0 ? "Generate Recommendation" : "Refresh"}
          </button>

          {/* 生成回数表示 */}
          <p className="text-sm text-gray-400 mt-2 text-center">
            {generateCount}/3 attempts used
          </p>

          {/* Saveボタン（レコメンドが生成されているときのみ） */}
          {generateCount >= 0 && generateCount <= 3 && (
            <button
              className="mt-6 bg-orange-400 text-black font-bold py-3 px-8 rounded-full shadow-md hover:bg-orange-500 transition"
              onClick={handleSaveRecommendation}
            >
              Save
            </button>
          )}
        </div>
      )}

      {/* 「レコメンド生成結果」 or 「今日のレコメンド」 を表示 */}
      {recommendation && (
        <div className="px-4 max-w-screen-lg mx-auto pb-12">
          <h2 className="text-lg font-semibold mb-4">
            {isSaved ? "Today's Recommendation" : "Generated Recommendation"}
          </h2>
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
                    disabled={isSaved}
                    onClick={(e) => {
                      e.stopPropagation(); // 親のonClickの発火を防ぐ
                      toggleLike(track.id);
                    }}
                  >
                    {isSaved ? (
                      //　// 保存済み（DBから取得）の場合
                      track.wasLiked ? (
                        <StarIcon sx={{ color: "orange" }} />
                      ) : (
                        <StarBorderIcon sx={{ color: "gray" }} />
                      )
                    ) : // 今生成されたレコメンドの場合
                    likedTrackIds.includes(track.id) ? (
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
