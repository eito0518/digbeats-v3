import { ArtistInfo } from "./artistInfo";

export class TrackInfo {
  constructor(
    private readonly _externalTrackId: number,
    private readonly _title: string,
    private readonly _artworkUrl: string,
    private readonly _permalinkUrl: string,
    private readonly _artist: ArtistInfo
  ) {}

  get externalTrackId() {
    return this._externalTrackId;
  }

  get permalinkUrl() {
    return this._permalinkUrl;
  }

  get artist() {
    return this._artist;
  }
}
