import { UserApiRepository } from "../../domain/interfaces/userApiRepository";
import { UserInfo } from "../../domain/valueObjects/userInfo";
import { config } from "../../config/config";
import axios from "axios";

export class UserSoundCloudRepository implements UserApiRepository {
  // ユーザー情報を取得
  async fetchUser(accessToken: string): Promise<UserInfo> {
    const endPoint = `${config.API_BASE_URL}/me`;
    const headers = {
      accept: "application/json; charset=utf-8",
      "Content-Type": "application/json; charset=utf-8",
      Authorization: accessToken,
    };

    try {
      const response = await axios.get(endPoint, { headers: headers });

      return new UserInfo(
        response.data.id,
        response.data.username,
        response.data.avatar_url,
        response.data.public_favorites_count,
        response.data.followings_count
      );
    } catch (error) {
      console.error("fetchUser request failed:", error);
      throw new Error("FetchUser request failed");
    }
  }
}
