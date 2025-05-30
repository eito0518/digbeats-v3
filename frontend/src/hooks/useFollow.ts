import { useEffect, useState } from "react";
import { Artist } from "../types/artistType";
import axios from "axios";

export const useFollow = () => {
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);

  useEffect(() => {
    // フォロー中のアーティストを取得
    const fetchFollowedArtists = async () => {
      try {
        const response = await axios.get("/api/users/followings", {
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
        await axios.delete("/api/followings", {
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
        await axios.post(
          "/api/followings",
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
