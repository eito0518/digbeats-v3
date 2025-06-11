import { useCallback, useEffect, useState } from "react";
import { Recommendation } from "../types/recommendationType";
import { apiClient } from "../auth/apiClient";

// 環境変数からデモモードかどうかを判定
const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";
// 生成回数の上限を定数として定義
const GENERATION_LIMIT = 3;

export const useRecommendation = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [todaysGenerateCount, setTodaysGenerateCount] = useState(0);
  const [animatedId, setAnimatedId] = useState<number | null>(null);

  useEffect(() => {
    // 「今日のレコメンド」 を取得する
    const fetchTodayRecommendation = async () => {
      try {
        const response = await apiClient.get("/recommendations/today", {
          withCredentials: true,
        });
        // 「今日のレコメンド」 がまだ無い場合
        if (!response.data.recommendations) {
          return;
        }
        // 「今日のレコメンド」 がある場合
        setRecommendations(response.data.recommendations || []);
        setTodaysGenerateCount(response.data.recommendations.length);
      } catch (error) {
        console.error(
          "[useRecommendation] Failed to fetch today recommendations : ",
          error
        );
      }
    };
    fetchTodayRecommendation();
  }, []);

  // レコメンドを生成する
  const handleGenerate = async () => {
    // デモモードではない場合のみ回数制限をチェックする
    if (!isDemoMode && todaysGenerateCount >= GENERATION_LIMIT) {
      console.log("Generation limit reached.");
      return;
    }
    // 生成を実行中の場合
    if (isGenerating) return;

    setIsGenerating(true); //　API通信前にローディングを開始

    try {
      const response = await apiClient.get("/recommendations");
      const newRecommendation = response.data.recommendation;
      // 生成したレコメンドを新しい順で追加
      setRecommendations((previous) => [newRecommendation, ...previous]);
      // 生成したレコメンドアニメーション対象に追加
      setAnimatedId(newRecommendation.recommendationId);
      setTimeout(() => setAnimatedId(null), 1000); //　アニメーションを解除
      // 生成回数を更新
      setTodaysGenerateCount((previous) => previous + 1);
    } catch (error) {
      console.error(
        "[useRecommendation] Failed to generate recommendation: ",
        error
      );
      alert("Failed to generate recommendation. Please try again.");
    } finally {
      setIsGenerating(false); //　API通信完了後にローディングを終了
    }
  };

  // いいねを切り替えてUIとバックエンドに反映する
  // useCallbackで 「無駄な関数の再生成」 を防ぐ (親コンポーネントが再レンダリングされた時など)
  const toggleLike = useCallback(
    async (trackId: number, recommendationId: number) => {
      // 対象楽曲の現在のいいね状態を取得
      let isCurrentlyLiked = false;
      const targetRecommendation = recommendations.find(
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
      const newRecommendations = recommendations.map((recommendation) => {
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
      setRecommendations(newRecommendations);

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
        console.error("[useRecommendation] Failed to toggle like:", error);
        // APIリクエストが失敗した場合はUIを元の状態に戻す
        alert("Failed to update like state. plese try again.");
        setRecommendations(recommendations); // stateもエラー発生前の状態に戻す
      }
    },
    [recommendations] // recommendations が更新された時だけ、この関数を再構築する
  );

  return {
    recommendations,
    isGenerating,
    todaysGenerateCount,
    animatedId,
    handleGenerate,
    toggleLike,
    isDemoMode,
    GENERATION_LIMIT,
  };
};
