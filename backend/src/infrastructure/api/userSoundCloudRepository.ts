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
            following.username,
            following.avatar_url,
            following.permalink_url,
            following.public_favorites_count,
            following.followers_count
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
      await axios.put(endPoint, null, { headers });
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

  // 楽曲のいいねを登録する
  async likeTrack(
    accessToken: string,
    soundcloudTrackId: number
  ): Promise<void> {
    const endPoint = `${config.API_BASE_URL}/likes/tracks/${soundcloudTrackId}`;

    const headers = {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`,
    };

    try {
      await axios.post(endPoint, null, { headers });
    } catch (error) {
      // エラーをthrowせず、ログ出力に留める
      const message = `Failed to like track (ID: ${soundcloudTrackId}): unable to communicate with SoundCloud API`;
      console.error(`[userSoundCloudRepository] ${message}`, error);
    }
  }

  // 楽曲のいいねを解除する
  async unlikeTrack(
    accessToken: string,
    soundcloudTrackId: number
  ): Promise<void> {
    const endPoint = `${config.API_BASE_URL}/likes/tracks/${soundcloudTrackId}`;

    const headers = {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`,
    };

    try {
      await axios.delete(endPoint, { headers });
    } catch (error) {
      // エラーをthrowせず、ログ出力に留める
      const message = `Failed to unlike track (ID: ${soundcloudTrackId}): unable to communicate with SoundCloud API`;
      console.error(`[userSoundCloudRepository] ${message}`, error);
    }
  }
}
