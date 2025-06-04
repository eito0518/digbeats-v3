import { Artist } from "../types/artistType";

type Props = {
  artists: Artist[];
  followedArtists: Artist[];
  onToggleFollow: (artist: Artist) => void;
};

export const ArtistList = ({
  artists,
  followedArtists,
  onToggleFollow,
}: Props) => {
  return (
    // アーティスト検索結果
    <div className="mt-4 space-y-4 px-4">
      {artists.map((artist) => {
        // フォロー中かどうか
        const isFollowed = followedArtists.some(
          (followedArtist) =>
            followedArtist.soundcloudArtistId === artist.soundcloudArtistId
        );

        return (
          <div
            key={artist.soundcloudArtistId}
            className="flex items-center justify-between"
          >
            {/* アーティストアバター */}
            <div className="flex items-center gap-3">
              <img src={artist.avatarUrl} className="w-12 h-12 rounded-full" />
              {/* アーティスト名・いいね曲数 */}
              <div>
                <p className="font-semibold">{artist.name}</p>
                <p className="text-sm text-gray-400">
                  {artist.likedTracksCount} tracks liked
                </p>
              </div>
            </div>
            {/* フォローボタン */}
            <button
              onClick={() => onToggleFollow(artist)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition 
              ${
                isFollowed
                  ? "bg-orange-400 text-white" // フォロー済み
                  : "border border-white text-white" // 未フォロー
              } 
            `}
            >
              {isFollowed ? "Following" : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
};
