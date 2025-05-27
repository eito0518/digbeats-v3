import { useState } from "react";
import { Artist } from "../types/artistType";
import axios from "axios";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Artist[]>([]);

  const handleSearch = async () => {
    // 検索クエリが空の場合は検索できない
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `/api/artists?artistName=${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Failed to search", error);
    }
  };

  const handleFollow = async (soundcloudArtistId: number) => {
    try {
      await axios.put(`/api/users/followings/${soundcloudArtistId}`);
      // フォロー状態を更新(searchResultsを更新)
      setSearchResults((previous) =>
        previous.map((artist) =>
          artist.soundcloudArtistId === soundcloudArtistId
            ? { ...artist, isFollowing: true } // isFollowingを更新して返す
            : artist
        )
      );
    } catch (error) {
      console.error("Failed to follow", error);
    }
  };

  const handleUnfollow = async (soundcloudArtistId: number) => {
    try {
      await axios.delete(`/api/users/followings/${soundcloudArtistId}`);
      setSearchResults((previous) =>
        previous.map((artist) =>
          artist.soundcloudArtistId === soundcloudArtistId
            ? { ...artist, isFollowing: false }
            : artist
        )
      );
    } catch (error) {
      console.error("Failed to unfollow", error);
    }
  };

  return {
    searchState: { searchQuery, searchResults },
    actions: {
      setSearchQuery,
      setSearchResults,
      handleSearch,
      handleFollow,
      handleUnfollow,
    },
  };
};
