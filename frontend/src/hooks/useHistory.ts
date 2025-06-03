import { useEffect, useState } from "react";
import { Recommendation } from "../types/recommendationType";
import { apiClient } from "../auth/apiClient";

export const useHistory = () => {
  const [histories, setHistories] = useState<Recommendation[]>([]);
  const [expandedRecommendationId, setExpandedRecommendationId] = useState<
    number | null
  >(null);

  useEffect(() => {
    // レコメンド履歴を取得
    const fetchHistories = async () => {
      try {
        const response = await apiClient.get("/recommendations/histories", {
          withCredentials: true,
        });
        setHistories(response.data);
      } catch (error) {
        console.error("Failed to fetch recommendation histories", error);
      }
    };

    fetchHistories();
  }, []);

  // レコメンドの展開状態を切り替え
  const toggleExpandRecommendation = (recommendationId: number) => {
    setExpandedRecommendationId(
      (previous: number | null) =>
        previous === recommendationId
          ? null // すでに展開されていたら閉じる
          : recommendationId // 別のレコメンドを展開ししていたら、上書きで切り替える
    );
  };

  return { histories, expandedRecommendationId, toggleExpandRecommendation };
};
