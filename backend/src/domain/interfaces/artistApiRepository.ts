import { ArtistInfo } from "../valueObjects/artistInfo";

export interface ArtistApiRepository {
  searchArtist(
    accessToken: string,
    artistName: string
  ): Promise<Array<ArtistInfo>>;
}
