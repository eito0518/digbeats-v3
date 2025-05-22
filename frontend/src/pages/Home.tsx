import { useState } from "react";
import logo from "../assets/digbeats-logo-transparent.png";

export const Home = () => {
  const [hasRecommended, setHasRecommended] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ロゴ ＋ 検索バー ＋ プロフィールアイコン */}
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 pt-6">
        {/* ロゴを左側に固定で表示 */}
        <img
          src={logo}
          alt="DigBeats Logo"
          className="w-15 h-15 object-contain"
        />
        {/* 検索バー + プロフィールアイコン */}
        <div className="flex items-center gap-2 w-[340px]">
          <input
            type="text"
            placeholder="🔍  Who is your favorite artist?"
            className="bg-neutral-900 text-white px-4 py-3 rounded-full w-full placeholder-gray-400"
            disabled
          />
          <button className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center aspect-square">
            👤
          </button>
        </div>
      </div>

      {/* レコメンドボタン（中央に固定表示） */}
      <div className="sticky top-4 z-10 flex justify-center w-full mt-20 sm:mt-16 mb-20 sm:mb-12">
        <button
          className="bg-white text-black font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition"
          onClick={() => setHasRecommended(true)}
        >
          Generate Recommendation
        </button>
      </div>

      {/* レコメンド結果(今日のレコメンドがある時のみ表示) */}
      {hasRecommended && (
        <div className="px-4 max-w-screen-lg mx-auto pb-12">
          <h2 className="text-lg font-semibold mb-4">Today’s Recommendation</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(10)].map((_, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-neutral-900 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="font-semibold">Track Title {i + 1}</p>
                  <p className="text-sm text-gray-400">Artist Name • 2:30</p>
                </div>
                <button className="text-orange-400 text-xl">❤️</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
