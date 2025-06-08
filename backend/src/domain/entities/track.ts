import { ArtistInfo } from "../valueObjects/artistInfo";

export class Track {
  constructor(
    private readonly _externalTrackId: number,
    private readonly _title: string,
    private readonly _artworkUrl: string,
    private readonly _permalinkUrl: string,
    private readonly _artist: ArtistInfo,
    private readonly _id?: number,
    private readonly _isLiked?: boolean
  ) {}

  get externalTrackId() {
    return this._externalTrackId;
  }

  get title() {
    return this._title;
  }

  get artworkUrl() {
    return this._artworkUrl;
  }

  get permalinkUrl() {
    return this._permalinkUrl;
  }

  get artist() {
    return this._artist;
  }

  get id() {
    return this._id;
  }

  get isLiked(): boolean {
    return this._isLiked ?? false; // isLikedがセットされていなければ、デフォルトでfalseを返す
  }

  // IDを付与した新しいTrackを返す
  withId(id: number): Track {
    return new Track(
      this._externalTrackId,
      this._title,
      this._artworkUrl,
      this._permalinkUrl,
      this._artist,
      id,
      this._isLiked
    );
  }

  // 自身がIDを持っているかどうかを判定し、IDを返す
  requireId(): number {
    if (this._id === undefined) {
      throw new Error(
        "Track instance does not have an ID (required for persistence)"
      );
    }
    return this._id;
  }
}
