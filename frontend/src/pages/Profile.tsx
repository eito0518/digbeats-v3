import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { useHistory } from "../hooks/useHistory";
import { useFollow } from "../hooks/useFollow";
import { useLike } from "../hooks/useLike";
import { useTrack } from "../hooks/useTrack";
import { HistoryList } from "../components/HistoryList";
import { ArtistList } from "../components/ArtistList";
import { Avatar } from "@mui/material";

export const Profile = () => {
  const navigate = useNavigate();
  // プロフィール画面のモードを切り替えるHooks
  const [isViewingFollowings, setIsViewingFollowings] = useState(false);
  // プロフィール画面のHooks
  const { user } = useUser();
  // フォロー中アーティスト一覧画面のHooks
  const { fetchedFollowedArtists, followedArtists, toggleFollow } = useFollow();
  // レコメンド履歴のHooks
  const { histories, expandedRecommendationId, toggleExpandRecommendation } =
    useHistory();
  const { likedTrackIds, toggleLike } = useLike();
  const { expandedTrackId, toggleExpandTrack } = useTrack();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-4 space-y-6">
      {/* 状態変数によってプロフィール画面を切り替え */}
      {isViewingFollowings ? (
        // フォロー中アーティスト一覧画面
        <>
          {/* フォロー中アーティスト一覧 */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">Following Artists</p>
            <button
              className="text-sm text-gray-400"
              onClick={() => setIsViewingFollowings(false)}
            >
              Back
            </button>
          </div>
          <ArtistList
            artists={fetchedFollowedArtists}
            followedArtists={followedArtists}
            onToggleFollow={toggleFollow}
          />
        </>
      ) : (
        <>
          {/* ホーム画面に戻るボタン */}
          <div className="flex justify-end">
            <button
              className="text-sm text-gray-400 hover:underline"
              onClick={() => navigate("/")}
            >
              Back
            </button>
          </div>

          {/* プロフィールセクション */}
          <div className="flex flex-col items-center gap-2">
            <Avatar
              src={user?.avatarUrl}
              alt={user?.name}
              sx={{ width: 96, height: 96 }}
            />
            <p className="text-xl font-bold">{user?.name ?? "Unknown User"}</p>

            <div className="flex gap-8 mt-2 text-center">
              <div>
                <p className="text-lg font-semibold">{histories.length}</p>
                <p className="text-xs text-gray-400">Recommendations</p>
              </div>
              <div
                className="cursor-pointer hover:underline"
                onClick={() => setIsViewingFollowings(true)}
              >
                <p className="text-lg font-semibold">
                  {followedArtists.length}
                </p>
                <p className="text-xs text-gray-400">Followings</p>
              </div>
            </div>
          </div>

          {/* レコメンド履歴 */}
          <div className="space-y-2">
            <p className="text-base font-semibold">Recommendation History</p>
            <HistoryList
              recommendations={histories}
              expandedRecommendationId={expandedRecommendationId}
              likedTrackIds={likedTrackIds}
              expandedTrackId={expandedTrackId}
              onToggleExpandRecommendation={toggleExpandRecommendation}
              onToggleLike={toggleLike}
              onToggleExpandTrack={toggleExpandTrack}
            />
          </div>
        </>
      )}
    </div>
  );
};
