export class ArtistInfo {
  constructor(
    private readonly _externalUserId: number,
    private readonly _name: string,
    private readonly _avatarUrl: string,
    private readonly _likedTracksCount: number,
    private readonly _permalinkUrl: string
  ) {}

  get externalUserId() {
    return this._externalUserId;
  }

  get likedTracksCount() {
    return this._likedTracksCount;
  }
}
