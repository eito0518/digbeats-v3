type Props = {
  generateCount: number;
  onGenerate: () => void;
  onSave: () => void;
  canSave: boolean;
};

export const RecommendationButtons = ({
  generateCount,
  onGenerate,
  onSave,
  canSave,
}: Props) => {
  return (
    // レコメンドボタン
    <div className="flex flex-col items-center w-full mt-20 sm:mt-16 mb-20 sm:mb-12">
      {/* Generate (Refresh) ボタン */}
      <button
        className="bg-white text-black font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition disabled:opacity-50"
        onClick={onGenerate}
        disabled={generateCount >= 3} // ３回まで生成可能
      >
        {generateCount === 0 ? "Generate Recommendation" : "Refresh"}
      </button>

      {/* 生成可能回数 */}
      <p className="text-sm text-gray-400 mt-2 text-center">
        {generateCount}/3 attempts used
      </p>

      {/* Saveボタン */}
      {canSave && (
        <button
          className="mt-6 bg-orange-400 text-black font-bold py-3 px-8 rounded-full shadow-md hover:bg-orange-500 transition"
          onClick={onSave}
        >
          Save
        </button>
      )}
    </div>
  );
};
