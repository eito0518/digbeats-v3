import { useState } from "react";
import { useRecommendation } from "../hooks/useRecommendation";
import { useSearch } from "../hooks/useSearch";
import { HeaderBar } from "../components/HeaderBar";
import { RecommendationButtons } from "../components/RecommendationButtons";
import { RecommendedTrackList } from "../components/RecommendedTrackList";
import { SearchResultList } from "../components/SearchResultList";

export const Home = () => {
  const [isSearching, setIsSearching] = useState(false); // 検索モード

  const {
    recommendationState: {
      recommendation,
      isSaved,
      generateCount,
      likedTrackIds,
      expandedTrackId,
    },
    actions: { handleGenerate, handleSave, toggleLike, toggleExpand },
  } = useRecommendation();

  const {
    searchState: { searchQuery, searchResults },
    actions: { setSearchQuery, setSearchResults, handleSearch, handleFollow },
  } = useSearch();

  // 「まだ今日のレコメンドが無い」 かつ 「生成されたレコメンドがある」　場合に保存できる
  const canSave = !isSaved && recommendation !== null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ロゴ ＋ 検索バー ＋ プロフィールアイコン */}
      <HeaderBar
        // モード切り替え
        isSearching={isSearching}
        onSearchFocus={() => setIsSearching(true)}
        onSearchCancel={() => {
          setIsSearching(false);
          setSearchQuery(""); // クエリをクリア
          setSearchResults([]); // 検索結果もクリア
        }}
        // 検索機能
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery} // 通知されたら、検索クエリを変更
        onSearchSubmit={handleSearch} // 通知されたら、検索処理
      />

      {/* アーティスト検索結果 */}
      {isSearching ? (
        <SearchResultList
          searchResults={searchResults}
          onFollow={handleFollow}
        />
      ) : (
        <>
          {/* レコメンドボタン */}
          <RecommendationButtons
            generateCount={generateCount}
            onGenerate={handleGenerate}
            onSave={handleSave}
            canSave={canSave}
          />

          {/* 「レコメンド生成結果」 or 「今日のレコメンド」 を表示 */}
          <RecommendedTrackList
            tracks={recommendation?.tracks || []} // mapで使うため、track　が　undefined　の場合は　[] を渡す
            isSaved={isSaved}
            likedTrackIds={likedTrackIds}
            expandedTrackId={expandedTrackId}
            onToggleLike={toggleLike}
            onToggleExpand={toggleExpand}
          />
        </>
      )}
    </div>
  );
};
