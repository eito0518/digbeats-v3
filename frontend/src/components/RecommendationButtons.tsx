type Props = {
  todaysGenerateCount: number;
  onGenerate: () => void;
  isDemoMode: boolean;
  limit: number;
};

export const RecommendationButtons = ({
  todaysGenerateCount,
  onGenerate,
  isDemoMode,
  limit,
}: Props) => {
  // デモモードでない場合のみ無効化の判定をする
  const isDisabled = !isDemoMode && todaysGenerateCount >= limit;

  return (
    // レコメンドボタンを表示
    <div className="flex flex-col items-center w-full mt-20 sm:mt-16 mb-20 sm:mb-12">
      {/* レコメンド生成ボタン */}
      <button
        className="bg-orange-400 text-black font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition disabled:opacity-50"
        onClick={onGenerate}
        disabled={isDisabled} // 制限を超えた場合はボタンを無効化
      >
        Generate Recommendation
      </button>

      {/* 生成可能回数 */}
      <p className="text-sm text-gray-400 mt-2 text-center">
        {isDemoMode
          ? "Infinite attempts (Demo Mode)"
          : `${todaysGenerateCount} / ${limit} attempts used`}
      </p>
    </div>
  );
};
