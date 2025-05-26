import { useRecommendation } from "../hooks/useRecommendation";
import { HeaderBar } from "../components/HeaderBar";
import { RecommendationButtons } from "../components/RecommendationButtons";
import { RecommendedTrackList } from "../components/RecommendedTrackList";

export const Home = () => {
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

  // 「まだ今日のレコメンドが無い」 かつ 「生成されたレコメンドがある」　場合に保存できる
  const canSave = !isSaved && recommendation !== null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ロゴ ＋ 検索バー ＋ プロフィールアイコン */}
      <HeaderBar />

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
    </div>
  );
};
