import { UserApiRepository } from "../../domain/interfaces/userApiRepository";
import { UserInfo } from "../../domain/valueObjects/userInfo";
import { config } from "../../config/config";
import axios from "axios";
import { ArtistInfo } from "../../domain/valueObjects/artistInfo";

export class UserSoundCloudRepository implements UserApiRepository {
  // 自分のユーザー情報を取得する
  async fetchMyUserInfo(accessToken: string): Promise<UserInfo> {
    const endPoint = `${config.API_BASE_URL}/me`;

    const headers = {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`,
    };

    try {
      const response = await axios.get(endPoint, { headers });

      return new UserInfo(
        response.data.id,
        response.data.username,
        response.data.avatar_url,
        response.data.permalink_url
      );
    } catch (error) {
      const message =
        "Failed to fetch user info: unable to communicate with SoundCloud API";
      console.error(`[userSoundCloudRepository] ${message}`, error);
      throw new Error(message);
    }
  }

  // フォロー中のアーティスト情報を取得する
  async fetchFollowings(accessToken: string): Promise<Array<ArtistInfo>> {
    const endPoint = `${config.API_BASE_URL}/me/followings`;

    const headers = {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`,
    };

    try {
      const response = await axios.get(endPoint, { headers });

      return response.data.collection.map(
        (following: any) =>
          new ArtistInfo(
            following.id,
            following.name,
            following.avatar_url,
            following.permalink_url,
            following.public_favorites_count
          )
      );
    } catch (error) {
      const message =
        "Failed to fetch followings: unable to communicate with SoundCloud API";
      console.error(`[userSoundCloudRepository] ${message}`, error);
      throw new Error(message);
    }
  }

  // アーティストをフォローする
  async followArtist(
    accessToken: string,
    soundcloudArtistId: number
  ): Promise<void> {
    const endPoint = `${config.API_BASE_URL}/me/followings/${soundcloudArtistId}`;

    const headers = {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`,
    };

    try {
      await axios.put(endPoint, { headers });
    } catch (error) {
      const message = `Failed to follow artist (ID: ${soundcloudArtistId}): unable to communicate with SoundCloud API`;
      console.error(`[userSoundCloudRepository] ${message}`, error);
      throw new Error(message);
    }
  }

  // アーティストのフォローを解除する
  async unfollowArtist(
    accessToken: string,
    soundcloudArtistId: number
  ): Promise<void> {
    const endPoint = `${config.API_BASE_URL}/me/followings/${soundcloudArtistId}`;

    const headers = {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`,
    };

    try {
      await axios.delete(endPoint, { headers });
    } catch (error) {
      const message = `Failed to unfollow artist (ID: ${soundcloudArtistId}): unable to communicate with SoundCloud API`;
      console.error(`[userSoundCloudRepository] ${message}`, error);
      throw new Error(message);
    }
  }

  // いいねした楽曲の SoundCloudId を取得する
  async fetchLikedSoundCloudTrackIds(
    accessToken: string,
    maxPageCount: number
  ): Promise<number[]> {
    // urlの初期値
    const endPoint = `${config.API_BASE_URL}/me/likes/tracks`;

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
      // 取得した楽曲のIDを空配列に順番にプッシュ
      const soundcloudTrackIds: number[] = [];
      let url: string | null = endPoint;
      const params = initialParams;
      let pageCount = 0;

      // ページ数が上限未満 かつ まだ次のページのURLがある　場合繰り返す
      while (pageCount < maxPageCount && url) {
        const response: any = await axios.get(url, {
          headers,
          ...(url === endPoint ? { params } : {}), // スプレッド構文で条件付き展開
        });
        soundcloudTrackIds.push(
          ...this.mapToSoundCloudTrackId(response.data.collection)
        ); // number[] をスプレッド構文で展開してプッシュ
        url = response.data.next_href; // urlを更新
        pageCount++; // ページ数を更新
      }

      return soundcloudTrackIds;
    } catch (error) {
      const message = `Failed to fetch my liked tracks: unable to communicate with SoundCloud API`;
      console.error(`[userSoundCloudRepository] ${message}`, error);
      throw new Error(message);
    }
  }

  // APIレスポンスのトラック一覧を SoundCloudIdの配列 に変換する関数
  private mapToSoundCloudTrackId(collection: any[]): number[] {
    return collection.map((track: any) => track.id);
  }
}
