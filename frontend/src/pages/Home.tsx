import { useState } from "react";
import { useSearch } from "../hooks/useSearch";
import { useFollow } from "../hooks/useFollow";
import { useRecommendation } from "../hooks/useRecommendation";
import { useLike } from "../hooks/useLike";
import { useTrack } from "../hooks/useTrack";
import { HeaderBar } from "../components/HeaderBar";
import { RecommendationButtons } from "../components/RecommendationButtons";
import { ArtistList } from "../components/ArtistList";
import { RecommendationList } from "../components/RecommendationList";

export const Home = () => {
  // 画面切り替え用のHooks
  const [isSearching, setIsSearching] = useState(false);
  // アーティスト検索画面のHooks
  const { artists, searchQuery, setArtists, setSearchQuery, handleSearch } =
    useSearch();
  const { followedArtists, toggleFollow } = useFollow();
  // レコメンド画面のHooks
  const { recommendations, todaysGenerateCount, animatedId, handleGenerate } =
    useRecommendation();
  const { likedTrackIds, toggleLike } = useLike();
  const { expandedTrackId, toggleExpandTrack } = useTrack();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ロゴ ＋ 検索バー ＋ プロフィールアイコン */}
      <HeaderBar
        isSearching={isSearching}
        onSearchFocus={() => setIsSearching(true)} // 検索画面に切り替え
        onSearchCancel={() => {
          setIsSearching(false); // レコメンド画面に切り替え
          setSearchQuery(""); // クエリをクリア
          setArtists([]); // 検索結果もクリア
        }}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery} // 検索クエリを変更
        onSearchSubmit={handleSearch} // 検索処理
      />

      {/* 状態変数によってホーム画面を切り替え */}
      {isSearching ? (
        // アーティスト検索画面
        <ArtistList
          artists={artists}
          followedArtists={followedArtists}
          onToggleFollow={toggleFollow}
        />
      ) : (
        // レコメンド画面
        <>
          {/* レコメンドボタン */}
          {todaysGenerateCount < 3 ? (
            <RecommendationButtons
              todaysGenerateCount={todaysGenerateCount}
              onGenerate={handleGenerate}
            />
          ) : (
            <div className="text-center text-gray-400 mt-16 mb-12">
              <p>That’s all for today’s recommendations.</p>
              <p>See you again tomorrow!</p>
            </div>
          )}

          {/* 今日のレコメンド */}
          {recommendations.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <p>You haven’t generated any recommendations today.</p>
            </div>
          ) : (
            <RecommendationList
              recommendations={recommendations}
              animatedId={animatedId}
              likedTrackIds={likedTrackIds}
              expandedTrackId={expandedTrackId}
              onToggleLike={toggleLike}
              onToggleExpandTrack={toggleExpandTrack}
            />
          )}
        </>
      )}
    </div>
  );
};
