import axios from "axios";
import { useState } from "react";

export const useLike = () => {
  const [likedTrackIds, setLikedTrackIds] = useState<number[]>([]);

  // いいね状態を切り替えてバックエンドにも反映
  const toggleLike = async (trackId: number, recommendationId: number) => {
    const isCurrentlyLiked = likedTrackIds.includes(trackId);

    try {
      if (isCurrentlyLiked) {
        // いいね解除
        await axios.delete("/api/likes", {
          data: { trackId, recommendationId },
          withCredentials: true,
        });
        setLikedTrackIds((previous) => previous.filter((id) => id !== trackId));
      } else {
        // いいね登録
        await axios.post(
          `/api/likes`,
          { trackId, recommendationId },
          { withCredentials: true }
        );
        setLikedTrackIds((previous) => [...previous, trackId]);
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
      alert("Failed to update like. Please try again.");
    }
  };

  return {
    likedTrackIds,
    toggleLike,
  };
};
