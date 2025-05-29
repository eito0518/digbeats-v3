import { Artist } from "../types/artistType";

type Props = {
  artists: Artist[];
  followedSoundCloudArtistIds: number[];
  onToggleFollow: (soundcloudArtistId: number) => void;
};

export const ArtistList = ({
  artists,
  followedSoundCloudArtistIds,
  onToggleFollow,
}: Props) => {
  return (
    // アーティスト検索結果
    <div className="mt-4 space-y-4 px-4">
      {artists.map((artist) => (
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
            onClick={() => onToggleFollow(artist.soundcloudArtistId)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition 
              ${
                followedSoundCloudArtistIds.includes(artist.soundcloudArtistId)
                  ? "bg-orange-400 text-white" // フォロー済み
                  : "border border-white text-white" // 未フォロー
              } 
            `}
          >
            {followedSoundCloudArtistIds.includes(artist.soundcloudArtistId)
              ? "Following"
              : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
};
