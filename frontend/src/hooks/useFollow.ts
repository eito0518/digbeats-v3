import { useEffect, useState } from "react";
import axios from "axios";

export const useFollow = () => {
  const [followedSoundCloudArtistIds, setFollowedSoundCloudArtistIds] =
    useState<number[]>([]);

  useEffect(() => {
    const fetchFollowedIds = async () => {
      try {
        const response = await axios.get("/api/users/followings", {
          withCredentials: true,
        });
        const soundcloudArtistIds = response.data.map(
          (artist: any) => artist.soundcloudArtistId
        );
        setFollowedSoundCloudArtistIds(soundcloudArtistIds);
      } catch (err) {
        console.error("Failed to fetch followed artists", err);
      }
    };

    fetchFollowedIds();
  }, []);

  // フォロー状態を切り替えてバックエンドにも反映
  const toggleFollow = async (soundcloudArtistId: number) => {
    const isCurrentlyFollowed =
      followedSoundCloudArtistIds.includes(soundcloudArtistId);

    try {
      if (isCurrentlyFollowed) {
        // フォロー解除
        await axios.delete("/api/followings", {
          data: { soundcloudArtistId },
          withCredentials: true,
        });
        setFollowedSoundCloudArtistIds((previous) =>
          previous.filter((id) => id !== soundcloudArtistId)
        );
      } else {
        // フォロー登録
        await axios.post(
          "/api/followings",
          { soundcloudArtistId },
          { withCredentials: true }
        );
        setFollowedSoundCloudArtistIds((previous) => [
          ...previous,
          soundcloudArtistId,
        ]);
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
      alert("Failed to update like. Please try again.");
    }
  };

  return {
    followedSoundCloudArtistIds,
    toggleFollow,
  };
};
