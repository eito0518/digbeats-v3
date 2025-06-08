import { useState } from "react";
import { useSearch } from "../hooks/useSearch";
import { useFollow } from "../hooks/useFollow";
import { useRecommendation } from "../hooks/useRecommendation";
import { useTrack } from "../hooks/useTrack";
import { HeaderBar } from "../components/HeaderBar";
import { RecommendationButtons } from "../components/RecommendationButtons";
import { ArtistList } from "../components/ArtistList";
import { RecommendationList } from "../components/RecommendationList";

export const Home = () => {
  // ホーム画面のモードを切り替えるHooks
  const [isSearching, setIsSearching] = useState(false);
  // アーティスト検索画面のHooks
  const {
    artists,
    searchQuery,
    isSearchingArtist,
    setArtists,
    setSearchQuery,
    handleSearch,
  } = useSearch();
  const { followedArtists, toggleFollow } = useFollow();
  // レコメンド画面のHooks
  const {
    recommendations,
    isGenerating,
    todaysGenerateCount,
    animatedId,
    handleGenerate,
    toggleLike,
  } = useRecommendation();
  const { expandedTrackId, toggleExpandTrack } = useTrack();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ロゴ ＋ 検索バー ＋ プロフィールアイコン */}
      <HeaderBar
        isSearching={isSearching}
        onSearchFocus={() => setIsSearching(true)} // 「検索画面」 に切り替え
        onSearchCancel={() => {
          setIsSearching(false); // 「レコメンド画面」 に切り替え
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
        <div className="w-full max-w-screen-md mx-auto">
          {isSearchingArtist ? (
            // ローディング表示
            <div className="flex flex-col items-center justify-center text-center text-gray-400 mt-16 mb-12 gap-4">
              <p>Searching artists...</p>
              {/* ローディングスピナー */}
              <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            // 検索結果表示
            <ArtistList
              artists={artists}
              followedArtists={followedArtists}
              onToggleFollow={toggleFollow}
            />
          )}
        </div>
      ) : (
        // レコメンド画面
        <>
          {/* レコメンドボタン or ローディング表示 */}
          <div className="w-full max-w-screen-lg mx-auto px-4">
            {isGenerating ? (
              // ローディング表示
              <div className="flex flex-col items-center justify-center text-center text-gray-400 mt-16 mb-12 gap-4">
                <p>Generating recommendations...</p>
                {/* ローディングスピナー */}
                <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              // レコメンドボタン
              todaysGenerateCount < 10 && ( // 3回未満の場合のみボタン表示　　// デバック
                <RecommendationButtons
                  todaysGenerateCount={todaysGenerateCount}
                  onGenerate={handleGenerate}
                />
              )
            )}

            {/* 生成回数が上限に達した場合のメッセージ */}
            {!isGenerating && todaysGenerateCount >= 3 && (
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
              <div className="mt-8">
                <p className="text-xl font-bold mb-4">
                  Today's Recommendations
                </p>
                <RecommendationList
                  recommendations={recommendations}
                  animatedId={animatedId}
                  expandedTrackId={expandedTrackId}
                  onToggleLike={toggleLike}
                  onToggleExpandTrack={toggleExpandTrack}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
