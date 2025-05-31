export class UserInfo {
  constructor(
    private readonly _externalUserId: number,
    private readonly _name: string,
    private readonly _avatarUrl: string,
    private readonly _likedTracksCount: number, /// いらない？
    private readonly _followingsCount: number /// いらない？
  ) // TODO:  permalinkUrl　必要
  {}

  get externalUserId() {
    return this._externalUserId;
  }
}
