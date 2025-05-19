import { TrackInfo } from "../../domain/valueObjects/trackInfo";
import { config } from "../../config/config";
import axios from "axios";
import { ArtistInfo } from "../../domain/valueObjects/artistInfo";

export class TrackSoundCloudRepository {
  //　アーティストのいいね曲を取得
  async fetchLikedTracks(
    accessToken: string,
    soundcloudUserId: number,
    maxPageCount: number
  ): Promise<TrackInfo[]> {
    const endPoint = `${config.API_BASE_URL}/users/${soundcloudUserId}/likes/tracks`;

    const headers = {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`,
    };

    const initialParams = {
      limit: 50,
      linked_partitioning: true,
    };

    try {
      // 取得した楽曲を空配列に順番にプッシュ
      const tracks: TrackInfo[] = [];
      let url: string | null = endPoint;
      const params = initialParams;
      let pageCount = 0;

      // ページ数が上限未満 かつ まだ次のページのURLがある場合
      while (pageCount < maxPageCount && url) {
        const response: any = await axios.get(url, {
          headers,
          ...(url === endPoint ? { params } : {}), // スプレッド構文で条件付き展開
        });
        tracks.push(...this.mapToTrackInfo(response.data.collection)); // スプレッド構文で展開してプッシュ
        url = response.data.next_href; // urlを更新
        pageCount++; // ページ数を更新
      }

      return tracks;
    } catch (error) {
      console.error("fetchLikedTracks request failed:", error);
      throw new Error("FetchLikedTracks request failed");
    }
  }

  // APIレスポンスのトラック一覧を TrackInfo[] に変換する関数
  private mapToTrackInfo(collection: any[]): TrackInfo[] {
    return collection.map(
      (track: any) =>
        new TrackInfo(
          track.id,
          track.title,
          track.artwork_url,
          track.permalink_url,
          new ArtistInfo(
            track.user.id,
            track.user.username,
            track.user.avatar_url,
            track.user.public_favorites_count,
            track.user.permalink_url
          )
        )
    );
  }
}
