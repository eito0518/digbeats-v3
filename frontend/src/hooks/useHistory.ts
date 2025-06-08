import { useCallback, useEffect, useState } from "react";
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
        setHistories(response.data.recommendations || []);
      } catch (error) {
        console.error(
          "[useHistory] Failed to fetch recommendation histories:",
          error
        );
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

  // いいねを切り替えてUIとバックエンドに反映する
  // useCallbackで 「無駄な関数の再生成」 を防ぐ (親コンポーネントが再レンダリングされた時など)
  const toggleLike = useCallback(
    async (trackId: number, recommendationId: number) => {
      // 対象楽曲の現在のいいね状態を取得
      let isCurrentlyLiked = false;
      const targetRecommendation = histories.find(
        (recommendation) => recommendation.recommendationId === recommendationId
      );
      if (targetRecommendation) {
        const targetTrack = targetRecommendation.tracks.find(
          (track) => track.id === trackId
        );
        if (targetTrack) {
          isCurrentlyLiked = targetTrack.isLiked;
        }
      }

      // UIを即時更新
      const newHistories = histories.map((recommendation) => {
        if (recommendation.recommendationId === recommendationId) {
          return {
            // 展開後にプロパティ指定で上書き
            ...recommendation,
            tracks: recommendation.tracks.map((track) => {
              if (track.id === trackId) {
                // 展開後にプロパティ指定で上書き
                return { ...track, isLiked: !track.isLiked }; // isLikedを反転
              }
              return track;
            }),
          };
        }
        return recommendation;
      });
      setHistories(newHistories);

      //　バックエンドに反映
      try {
        if (isCurrentlyLiked) {
          // いいね解除
          await apiClient.delete("/users/likes", {
            data: { trackId, recommendationId },
            withCredentials: true,
          });
        } else {
          // いいね登録
          await apiClient.post(
            "/users/likes",
            { trackId, recommendationId },
            { withCredentials: true }
          );
        }
      } catch (error) {
        console.error("[useHistory] Failed to toggle like:", error);
        // APIリクエストが失敗した場合はUIを元の状態に戻す
        alert("いいねの状態を更新できませんでした。");
        setHistories(histories); // stateもエラー発生前の状態に戻す
      }
    },
    [histories] // histories　が更新された時だけ、この関数を再構築する
  );

  return {
    histories,
    expandedRecommendationId,
    toggleLike,
    toggleExpandRecommendation,
  };
};
