import { Track } from "../../domain/entities/track";
import { config } from "../../config/config";
import axios from "axios";
import { ArtistInfo } from "../../domain/valueObjects/artistInfo";

export class TrackSoundCloudRepository {
  //　アーティストのいいね曲を取得する
  async fetchLikedTracks(
    accessToken: string,
    soundcloudUserId: number,
    maxPageCount: number
  ): Promise<Track[]> {
    // urlの初期値
    const endPoint = `${config.API_BASE_URL}/users/${soundcloudUserId}/likes/tracks`;

    const headers = {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`,
    };

    // パラメータの初期値
    const initialParams = {
      limit: 50,
      linked_partitioning: true,
    };

    // next_href　を用いて複数ページを取得する
    try {
      // 取得した楽曲を空配列に順番にプッシュ
      const tracks: Track[] = [];
      let url: string | null = endPoint;
      const params = initialParams;
      let pageCount = 0;

      // ページ数が上限未満 かつ まだ次のページのURLがある　場合繰り返す
      while (pageCount < maxPageCount && url) {
        const response: any = await axios.get(url, {
          headers,
          ...(url === endPoint ? { params } : {}), // スプレッド構文で条件付き展開
        });
        tracks.push(...this.mapToTrack(response.data.collection)); // Track[] をスプレッド構文で展開してプッシュ
        url = response.data.next_href; // urlを更新
        pageCount++; // ページ数を更新
      }

      return tracks;
    } catch (error) {
      const message = `Failed to fetch liked tracks (userID: ${soundcloudUserId}): unable to communicate with SoundCloud API`;
      console.error(`[trackSoundCloudRepository] ${message}`, error);
      throw new Error(message);
    }
  }

  // APIレスポンスのトラック一覧を Track[] に変換する関数
  private mapToTrack(collection: any[]): Track[] {
    return collection.map(
      (track: any) =>
        new Track(
          track.id,
          track.title,
          track.artwork_url,
          track.permalink_url,
          new ArtistInfo(
            track.user.id,
            track.user.username,
            track.user.avatar_url,
            track.user.permalink_url,
            track.user.public_favorites_count,
            track.user.followers_count
          )
        )
    );
  }
}
