import { config } from "../../config/config";
import axios from "axios";

export class LikeSoundCloudRepository {
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
      await axios.post(endPoint, undefined, { headers: headers });
    } catch (error) {
      console.error("likeTrack request failed:", error);
      throw new Error("LikeTrack request failed");
    }
  }
}
