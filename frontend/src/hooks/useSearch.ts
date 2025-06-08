import { useState } from "react";
import { Artist } from "../types/artistType";
import { apiClient } from "../auth/apiClient";

// 検索クエリを受け取り検索する
export const useSearch = () => {
  const [artists, setArtists] = useState<Artist[]>([]); // 検索結果のアーティスト
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingArtist, setIsSearchingArtist] = useState<boolean>(false);

  const handleSearch = async () => {
    // 検索クエリが空の場合は検索できない
    if (!searchQuery.trim() || isSearchingArtist) {
      console.warn("[useSearch] Search query is empty");
      return;
    }

    setIsSearchingArtist(true); // API通信前にローディングを開始

    try {
      const response = await apiClient.get(
        `/artists/search?artistName=${searchQuery}`
      );
      setArtists(response.data.artists);
    } catch (error) {
      console.error("[useSearch] Failed to search artist: ", error);
    } finally {
      setIsSearchingArtist(false); // API通信完了後にローディングを終了
    }
  };

  return {
    artists,
    searchQuery,
    isSearchingArtist,
    setArtists,
    setSearchQuery,
    handleSearch,
  };
};
