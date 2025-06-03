import { Track } from "../entities/track";

export interface TrackApiRepository {
  fetchLikedTracks(
    accessToken: string,
    externalUserId: number,
    maxPageCount: number
  ): Promise<Track[]>;
}
