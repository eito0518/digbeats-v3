export class ArtistInfo {
  constructor(
    private readonly _externalUserId: number,
    private readonly _name: string,
    private readonly _avatarUrl: string,
    private readonly _permalinkUrl: string,
    private readonly _likedTracksCount?: number // フェッチ時のみ
  ) {}

  get externalUserId() {
    return this._externalUserId;
  }

  get name() {
    return this._name;
  }

  get avatarUrl() {
    return this._avatarUrl;
  }

  get permalinkUrl() {
    return this._permalinkUrl;
  }

  get likedTracksCount() {
    return this._likedTracksCount;
  }
}
