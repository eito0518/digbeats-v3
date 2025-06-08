import { useEffect, useState } from "react";
import { Artist } from "../types/artistType";
import { apiClient } from "../auth/apiClient";

export const useFollow = () => {
  const [fetchedFollowedArtists, setFetchedFollowedArtists] = useState<
    Artist[]
  >([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // フォロー中のアーティストを取得する
    const fetchFollowedArtists = async () => {
      try {
        const response = await apiClient.get("/users/followings", {
          withCredentials: true,
        });
        setFetchedFollowedArtists(response.data.artists);
        setFollowedArtists(response.data.artists);
      } catch (error) {
        console.error("[useFollow] Failed to fetch followed artists: ", error);
      } finally {
        // ローディングを終了する
        setIsLoading(false);
      }
    };

    fetchFollowedArtists();
  }, []);

  // フォロー状態を切り替えてバックエンドに反映
  const toggleFollow = async (artist: Artist) => {
    // 既にフォロー済みかどうか
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
    fetchedFollowedArtists,
    followedArtists,
    isLoading,
    toggleFollow,
  };
};
