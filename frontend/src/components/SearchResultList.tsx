import { Artist } from "../types/artistType";

type Props = {
  searchResults: Artist[];
  onFollow: (soundcloudArtistId: number) => void;
};

export const SearchResultList = ({ searchResults, onFollow }: Props) => {
  return (
    // アーティスト検索結果
    <div className="mt-4 space-y-4 px-4">
      {searchResults.map((artist) => (
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
            onClick={() => onFollow(artist.soundcloudArtistId)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition 
              ${
                artist.isFollowing
                  ? "bg-orange-400 text-white"
                  : "border border-white text-white"
              } 
            `}
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};
