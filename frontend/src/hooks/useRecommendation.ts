import { useEffect, useState } from "react";
import { Recommendation } from "../types/recommendationType";
import axios from "axios";

export const useRecommendation = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [isSaved, setIsSaved] = useState(false); // 「今日のレコメンド」 が保存済みかどうか
  const [generateCount, setGenerateCount] = useState(0);
  const [likedTrackIds, setLikedTrackIds] = useState<number[]>([]);
  const [expandedTrackId, setExpandedTrackId] = useState<number | null>(null); // 展開するのは１つだけ

  // 「今日のレコメンド」 が既に保存済みか確認
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
        console.error("Failed to fetch today recommendation ", error);
      }
    };
    fetchTodayRecommendation();
  }, []); // ホーム画面マウント時に発火

  // レコメンドを生成
  const handleGenerate = async () => {
    // ３回以上は生成できない
    if (generateCount >= 3) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/recommendations`
      );
      setRecommendation(response.data); // 生成したレコメンドをセット
      setLikedTrackIds([]); // 生成時にいいね状態リセット (リフレッシュしたとき残っていたら困る)
      setGenerateCount((previous) => previous + 1);
    } catch (error) {
      console.error("Failed to genarate recommendation ", error);
    }
  };

  // レコメンドを保存
  const handleSave = async () => {
    // 「レコメンドが無い」 or 「今日のレコメンドが既に保存済み」 の場合は保存できない
    if (!recommendation || isSaved) return;

    try {
      await axios.post(
        `/api/recommendations/${recommendation.recommendationId}/likes`,
        { likes: likedTrackIds },
        { withCredentials: true }
      );
      setIsSaved(true); // 保存済みとして記録
    } catch (error) {
      console.error("Failed to save recommendation", error);
      alert("保存に失敗しました");
    }
  };

  // いいね状態を切り替え
  const toggleLike = (trackId: number) => {
    setLikedTrackIds(
      (previous) =>
        previous.includes(trackId)
          ? previous.filter((id) => id !== trackId) // 取り除く （IDが一致しないものを選ぶ）
          : [...previous, trackId] // 追加する
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

  return {
    recommendationState: {
      recommendation,
      isSaved,
      generateCount,
      likedTrackIds,
      expandedTrackId,
    },
    actions: {
      handleGenerate,
      handleSave,
      toggleLike,
      toggleExpand,
    },
  };
};
