type Props = {
  todaysGenerateCount: number;
  onGenerate: () => void;
};

export const RecommendationButtons = ({
  todaysGenerateCount,
  onGenerate,
}: Props) => {
  return (
    // レコメンドボタンを表示
    <div className="flex flex-col items-center w-full mt-20 sm:mt-16 mb-20 sm:mb-12">
      {/* レコメンド生成ボタン */}
      <button
        className="bg-orange-400 text-black font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition disabled:opacity-50"
        onClick={onGenerate}
        disabled={todaysGenerateCount >= 10} // ３回生成でボタンを無効化  // デバック
      >
        Generate Recommendation
      </button>

      {/* 生成可能回数 */}
      <p className="text-sm text-gray-400 mt-2 text-center">
        {todaysGenerateCount}/3 attempts used
      </p>
    </div>
  );
};
