import { useState } from "react";
import { Artist } from "../types/artistType";
import axios from "axios";

export const useSearch = () => {
  const [artists, setArtists] = useState<Artist[]>([]); // 検索結果のアーティスト
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    // 検索クエリが空の場合は検索できない
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `/api/artists?artistName=${searchQuery}`
      );
      setArtists(response.data);
    } catch (error) {
      console.error("Failed to search", error);
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
