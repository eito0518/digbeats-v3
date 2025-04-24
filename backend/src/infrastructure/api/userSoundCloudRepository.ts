import {
  UserApiRepository,
  GetUserResponse,
} from "../../domain/interfaces/userApiRepository";
import { config } from "../../config/config";
import axios from "axios";

export class UserSoundCloudRepository implements UserApiRepository {
  // ユーザー情報を取得
  async getUser(accessToken: string): Promise<GetUserResponse> {
    const endPoint = `${config.soundcloudApiBaseUrl}/me`;
    const headers = {
      accept: "application/json; charset=utf-8",
      "Content-Type": "application/json; charset=utf-8",
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(endPoint, { headers: headers });

      return {
        name: response.data.username,
        soundCloudUserId: response.data.id,
        avatarUrl: response.data.avatar_url,
        publicFavoritesCount: response.data.public_favorites_count,
        followingsCount: response.data.followings_count,
      };
    } catch (error) {
      console.error("getUser request failed:", error);
      throw new Error("getUser request failed");
    }
  }
}
