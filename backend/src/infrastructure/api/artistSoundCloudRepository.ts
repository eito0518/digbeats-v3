import { ArtistApiRepository } from "../../domain/interfaces/artistApiRepository";
import { ArtistInfo } from "../../domain/valueObjects/artistInfo";
import { config } from "../../config/config";
import axios from "axios";

export class ArtistSoundCloudRepository implements ArtistApiRepository {
  // アーティストを検索
  async searchArtist(
    accessToken: string,
    artistName: string
  ): Promise<Array<ArtistInfo>> {
    const endPoint = `${config.API_BASE_URL}/search/users`;

    const headers = {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`,
    };

    const params = {
      q: artistName,
      limit: 5,
    };

    try {
      const response = await axios.get(endPoint, {
        headers: headers,
        params: params,
      });

      return response.data.collection.map(
        (artist: any) =>
          new ArtistInfo(
            artist.id,
            artist.name,
            artist.avatar_url,
            artist.permalink_url,
            artist.public_favorites_count
          )
      );
    } catch (error) {
      const message =
        "Failed to search artists: unable to communicate with SoundCloud API";
      console.error(`[artistSoundCloudRepository] ${message}`, error);
      throw new Error(message);
    }
  }
}
