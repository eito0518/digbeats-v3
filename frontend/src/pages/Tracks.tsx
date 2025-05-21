import { useState, useEffect } from "react";
import axios from "axios";

export const Tracks = () => {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [artists, setArtists] = useState<any[] | null>(null);
  const [tracks, setTracks] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchArtistsAndTracks = async () => {
      try {
        // フォロー中アーティストを取得
        const response = await axios.get(
          `${VITE_API_BASE_URL}/api/me/followings`,
          { withCredentials: true } // Cookieを送信するために必要
        );
        const artistsList = response.data.users;
        setArtists(artistsList);

        // アーティストのいいね曲を１つずつ取得
        if (artistsList) {
          const responses = await Promise.all(
            artistsList.slice(0, 5).map(
              async (artist: any) =>
                await axios.get(
                  `${VITE_API_BASE_URL}/api/users/${artist.id}/likes/tracks`,
                  {
                    withCredentials: true, // Cookieに必要
                  }
                )
            )
          );
          const tracksList = responses.map((res) => res.data.tracks[0]);
          setTracks(tracksList);
        }
      } catch (error) {
        return console.error("データ取得に失敗しました", error);
      }
    };

    fetchArtistsAndTracks();
  }, []);

  return (
    <>
      <h1>あなたがフォローしているアーティスト</h1>
      {artists === null ? (
        <p>アーティスト読み込み中...</p>
      ) : artists.length === 0 ? (
        <p>フォローしているアーティストが見つかりませんでした。</p>
      ) : (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              {artist.username}（いいね数: {artist.publicFavoritesCount}）
            </li>
          ))}
        </ul>
      )}

      <h1>おすすめトラック</h1>
      {tracks === null ? (
        <p>トラック読み込み中...</p>
      ) : tracks.length === 0 ? (
        <p>いいね曲が見つかりませんでした。</p>
      ) : (
        tracks.map((track) =>
          track?.id && track?.title && track?.artworkUrl ? (
            <div key={track.id}>
              <h3>{track.title}</h3>
              <img src={track.artworkUrl} width={100} />
            </div>
          ) : null
        )
      )}
    </>
  );
};
