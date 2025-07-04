import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import logo from "../assets/app-logo.png";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar } from "@mui/material";

type Props = {
  isSearching: boolean;
  onSearchFocus: () => void;
  onSearchCancel: () => void;
  searchQuery: string;
  onSearchQueryChange: (searchQuery: string) => void;
  onSearchSubmit: () => void;
};

export const HeaderBar = ({
  isSearching,
  onSearchFocus,
  onSearchCancel,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}: Props) => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    // ロゴ ＋ 検索バー ＋ プロフィールアイコン
    <div className="w-full bg-black">
      <div className="flex items-center justify-between w-full  mx-auto px-4 pt-6">
        {/* ロゴ */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="DigBeats Logo"
            className="w-15 h-15 object-contain"
          />
          <p className="hidden md:block text-xl font-bold text-white">
            DIGBEATS
          </p>
        </div>
        {/* 検索バー + プロフィールアイコン */}
        <div className="flex items-center gap-2 w-full max-w-lg">
          <div className="relative w-full">
            {/* サーチアイコン */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            {/* 検索バー */}
            <input
              type="text"
              placeholder="Who is your favorite artist?"
              onFocus={onSearchFocus} // クリックされたら検索モードに入る
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)} //　入力の変更されたことを通知し searchQuery を書き換える
              onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()} // Enter が押されたことを通知し handleSearch を呼び出す
              className="bg-neutral-900 text-white pl-12 pr-4 py-3 rounded-full w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
          {/* プロフィールアイコン or 検索モード解除ボタン */}
          {isSearching ? (
            // 検索モード解除ボタン
            <button
              onClick={onSearchCancel}
              className="text-white text-sm px-3 py-1"
            >
              Cancel
            </button>
          ) : (
            // プロフィールアイコン
            <button onClick={() => navigate("/profile")}>
              <Avatar
                src={user?.avatarUrl} // 画像が設定されてなければ MUI のイニシャルアバター
                alt={user?.name}
                sx={{ width: 40, height: 40 }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
