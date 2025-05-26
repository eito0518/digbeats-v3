// components/HeaderBar.tsx
import logo from "../assets/digbeats-logo-transparent.png";

export const HeaderBar = () => {
  return (
    // ロゴ ＋ 検索バー ＋ プロフィールアイコン
    <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 pt-6">
      {/* ロゴ */}
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
  );
};
