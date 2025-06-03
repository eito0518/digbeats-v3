import { useEffect, useState } from "react";
import { apiClient } from "../auth/apiClient";

export const useLike = () => {
  const [likedTrackIds, setLikedTrackIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchLikedIds = async () => {
      try {
        const response = await apiClient.get("/users/likes", {
          withCredentials: true,
        });
        setLikedTrackIds(response.data.soundcloudTrackIds);
      } catch (err) {
        console.error("Failed to fetch liked tracks", err);
      }
    };

    fetchLikedIds();
  }, []);

  // いいね状態を切り替えてバックエンドにも反映
  const toggleLike = async (trackId: number, recommendationId: number) => {
    const isCurrentlyLiked = likedTrackIds.includes(trackId);

    try {
      if (isCurrentlyLiked) {
        // いいね解除
        await apiClient.delete("/users/likes", {
          data: { trackId, recommendationId },
          withCredentials: true,
        });
        setLikedTrackIds((previous) => previous.filter((id) => id !== trackId));
      } else {
        // いいね登録
        await apiClient.post(
          `/users/likes`,
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
