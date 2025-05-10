import { TrackInfo } from "../valueObjects/trackInfo";

export interface TrackApiRepository {
  fetchLikedTracks(
    accessToken: string,
    externalUserId: number,
    maxPageCount: number
  ): Promise<TrackInfo[]>;
}
