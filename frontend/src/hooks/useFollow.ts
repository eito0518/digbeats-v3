import { useEffect, useState } from "react";
import { Artist } from "../types/artistType";
import { apiClient } from "../auth/apiClient";

export const useFollow = () => {
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);

  useEffect(() => {
    // フォロー中のアーティストを取得
    const fetchFollowedArtists = async () => {
      try {
        const response = await apiClient.get("/users/followings", {
          withCredentials: true,
        });
        setFollowedArtists(response.data.artists);
      } catch (error) {
        console.error("Failed to fetch followed artists", error);
      }
    };

    fetchFollowedArtists();
  }, []);

  // フォロー状態を切り替えてバックエンドにも反映
  const toggleFollow = async (artist: Artist) => {
    const isFollowed = followedArtists.some(
      (a) => a.soundcloudArtistId === artist.soundcloudArtistId
    );

    try {
      if (isFollowed) {
        // フォロー解除
        await apiClient.delete("/followings", {
          data: { soundcloudArtistId: artist.soundcloudArtistId },
          withCredentials: true,
        });
        setFollowedArtists((previous) =>
          previous.filter(
            (a) => a.soundcloudArtistId !== artist.soundcloudArtistId
          )
        );
      } else {
        // フォロー登録
        await apiClient.post(
          "/followings",
          { soundcloudArtistId: artist.soundcloudArtistId },
          { withCredentials: true }
        );
        setFollowedArtists((previous) => [...previous, artist]);
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
      alert("Failed to update like. Please try again.");
    }
  };

  return {
    followedArtists,
    toggleFollow,
  };
};
