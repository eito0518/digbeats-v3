import { useEffect, useState } from "react";
import { Recommendation } from "../types/recommendationType";
import axios from "axios";

export const useRecommendation = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [todaysGenerateCount, setTodaysGenerateCount] = useState(0);
  const [animatedId, setAnimatedId] = useState<number | null>(null);

  useEffect(() => {
    // 「今日のレコメンド」 を取得
    const fetchTodayRecommendation = async () => {
      try {
        const response = await axios.get("/api/recommendations/today", {
          withCredentials: true,
        });
        // 「今日のレコメンド」 がまだ無い場合
        if (!response.data.recommendations) {
          return;
        }
        // 「今日のレコメンド」 がある場合
        setRecommendations(response.data.recommendations);
        setTodaysGenerateCount(response.data.recommendations.length);
      } catch (error) {
        console.error("Failed to fetch today recommendation ", error);
      }
    };
    fetchTodayRecommendation();
  }, []); // 初回マウント時に発火

  // レコメンドを生成
  const handleGenerate = async () => {
    // 1日３回以上は生成できない
    if (todaysGenerateCount >= 3) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/recommendations`
      );
      const newRecommendation = response.data;
      // 生成したレコメンドを新しい順で追加
      setRecommendations((previous) => [newRecommendation, ...previous]);
      // 生成したレコメンドアニメーション対象に追加
      setAnimatedId(newRecommendation.recommendationId);
      setTimeout(() => setAnimatedId(null), 1000); //　1秒後にアニメーションを解除
      // 生成回数を更新
      setTodaysGenerateCount((previous) => previous + 1);
    } catch (error) {
      console.error("Failed to genarate recommendation ", error);
    }
  };

  return {
    recommendations,
    todaysGenerateCount,
    animatedId,
    handleGenerate,
  };
};
