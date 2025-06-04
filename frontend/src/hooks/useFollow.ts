import { useEffect, useState } from "react";
import { Artist } from "../types/artistType";
import { apiClient } from "../auth/apiClient";

export const useFollow = () => {
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);

  useEffect(() => {
    // フォロー中のアーティストを取得する
    const fetchFollowedArtists = async () => {
      try {
        const response = await apiClient.get("/users/followings", {
          withCredentials: true,
        });
        setFollowedArtists(response.data.artists);
      } catch (error) {
        console.error("[useFollow] Failed to fetch followed artists: ", error);
      }
    };

    fetchFollowedArtists();
  }, []);

  // フォロー状態を切り替えてバックエンドに反映
  const toggleFollow = async (artist: Artist) => {
    const isFollowed = followedArtists.some(
      (followedArtist) =>
        followedArtist.soundcloudArtistId === artist.soundcloudArtistId
    );

    try {
      if (isFollowed) {
        // フォロー解除
        await apiClient.delete("/users/followings", {
          data: { soundcloudArtistId: artist.soundcloudArtistId },
          withCredentials: true,
        });
        setFollowedArtists((previous) =>
          previous.filter(
            (followedArtist) =>
              followedArtist.soundcloudArtistId !== artist.soundcloudArtistId
          )
        );
      } else {
        // フォロー登録
        await apiClient.post(
          "/users/followings",
          { soundcloudArtistId: artist.soundcloudArtistId },
          { withCredentials: true }
        );
        setFollowedArtists((previous) => [...previous, artist]);
      }
    } catch (error) {
      console.error("[useFollow] Failed to toggle follow: ", error);
      alert("Failed to update follow state. Please try again.");
    }
  };

  return {
    followedArtists,
    toggleFollow,
  };
};
