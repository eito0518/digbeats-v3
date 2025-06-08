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
  const { followedArtists, isLoading, toggleFollow } = useFollow();
  // レコメンド画面のHooks
  const {
    recommendations,
    isGenerating,
    todaysGenerateCount,
    animatedId,
    handleGenerate,
    toggleLike,
    isDemoMode,
    GENERATION_LIMIT,
  } = useRecommendation();
  const { expandedTrackId, toggleExpandTrack } = useTrack();

  // レコメンド生成要件
  // 条件1: いいね数が20以上のフォロー中アーティストが5人以上いるかどうか
  const totalLikedTracksCount = followedArtists.reduce(
    (sum, artist) => sum + (artist.likedTracksCount || 0),
    0
  );
  // 条件2: フォロー中アーティスト全体のいいねトラック総数が100以上かどうか
  const enoughLikesArtists = followedArtists.filter(
    (artist) => artist.likedTracksCount >= 20
  ).length;
  const hasEnoughLikesArtists = enoughLikesArtists >= 5;
  const hasEnoughTotalLikes = totalLikedTracksCount >= 100;
  const canGenerate = hasEnoughLikesArtists && hasEnoughTotalLikes;

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
            {isGenerating || isLoading ? (
              // どちらかがローディング中の場合はスピナーを表示
              <div className="flex flex-col items-center justify-center text-center text-gray-400 mt-16 mb-12 gap-4">
                <p>
                  {isGenerating
                    ? "Generating recommendations..."
                    : "Loading your data..."}
                </p>
                {/* ローディングスピナー */}
                <div
                  className={`w-10 h-10 border-4 ${
                    isGenerating ? `border-orange-400` : `border-gray-800`
                  } border-t-transparent rounded-full animate-spin`}
                />
              </div>
            ) : (
              // ローディングが完了してから、条件分岐のUIを表示する
              <>
                {(isDemoMode || todaysGenerateCount < GENERATION_LIMIT) &&
                  canGenerate && (
                    // レコメンドボタン
                    <RecommendationButtons
                      todaysGenerateCount={todaysGenerateCount}
                      onGenerate={handleGenerate}
                      isDemoMode={isDemoMode}
                      limit={GENERATION_LIMIT}
                    />
                  )}

                {/* レコメンド要件を満たさない場合のメッセージ */}
                {!canGenerate && !isGenerating && (
                  <div className="text-center text-gray-400 mt-16 mb-12 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-3">
                      Unlock Your Recommendations
                    </h3>
                    <p className="mb-5">
                      To generate recommendations tailored for you, please meet
                      the following requirements:
                    </p>
                    <ul className="text-left inline-block list-inside list-disc space-y-2 text-sm">
                      {/* 条件1の進捗表示 */}
                      <li className={"text-orange-400"}>
                        Follow 5 or more artists with 20+ liked tracks.
                        <span className="ml-2 font-mono text-yellow-500  px-2 py-1 rounded">
                          (Current: {enoughLikesArtists} / 5 artists)
                        </span>
                      </li>

                      {/* 条件2の進捗表示 */}
                      <li className={"text-orange-400"}>
                        Have 100+ total liked tracks from artists you follow.
                        <span className="ml-2 font-mono text-yellow-500 px-2 py-1 rounded">
                          (Current: {totalLikedTracksCount} / 100 tracks)
                        </span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* 生成回数が上限に達した場合のメッセージ */}
                {!isDemoMode &&
                  todaysGenerateCount >= GENERATION_LIMIT &&
                  !isGenerating && (
                    <div className="text-center text-gray-400 mt-16 mb-12">
                      <p>That’s all for today’s recommendations.</p>
                      <p>See you again tomorrow!</p>
                    </div>
                  )}

                {/* 今日のレコメンドがまだない場合のメッセージ */}
                {recommendations.length === 0 && (
                  <div className="text-center text-gray-400 mt-12">
                    <p>You haven’t generated any recommendations today.</p>
                  </div>
                )}
              </>
            )}

            {/* 今日のレコメンド */}
            {recommendations.length > 0 && (
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
