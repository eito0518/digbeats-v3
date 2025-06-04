import { useState } from "react";
import { Artist } from "../types/artistType";
import { apiClient } from "../auth/apiClient";

// 検索クエリを受け取り検索する
export const useSearch = () => {
  const [artists, setArtists] = useState<Artist[]>([]); // 検索結果のアーティスト
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    // 検索クエリが空の場合は検索できない
    if (!searchQuery.trim()) {
      console.warn("[useSearch] Search query is empty");
      return;
    }

    try {
      const response = await apiClient.get(
        `/artists/search?artistName=${searchQuery}`
      );
      setArtists(response.data.artists);
    } catch (error) {
      console.error("[useSearch] Failed to search artist: ", error);
    }
  };

  return {
    artists,
    searchQuery,
    setArtists,
    setSearchQuery,
    handleSearch,
  };
};
