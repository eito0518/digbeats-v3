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
    // アーティスト一覧
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
            className="flex items-center justify-between bg-neutral-900 rounded-xl px-4 py-3"
          >
            {/* アーティストアバターと情報 */}
            <div className="flex items-center gap-3">
              <img src={artist.avatarUrl} className="w-12 h-12 rounded-full" />
              <div className="flex flex-col">
                <a
                  href={artist.permalinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  {artist.name}
                </a>
                {/* フォロワー数・Like数*/}
                <div className="flex flex-col md:flex-row md:items-center md:gap-3 text-sm text-gray-400">
                  <p>
                    <span className="font-semibold">
                      {artist.followersCount.toLocaleString()}
                    </span>{" "}
                    followers
                  </p>
                  <p>
                    <span className="font-semibold">
                      {artist.likedTracksCount.toLocaleString()}
                    </span>{" "}
                    likes
                  </p>
                </div>
              </div>
            </div>
            {/* フォローボタン */}
            <button
              onClick={() => onToggleFollow(artist)}
              className={`w-24 text-center px-4 py-2 rounded-full text-sm font-semibold transition 
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
