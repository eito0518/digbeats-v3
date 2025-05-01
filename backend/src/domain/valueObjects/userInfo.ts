export class UserInfo {
  constructor(
    private readonly _externalUserId: number,
    private readonly _name: string,
    private readonly _avatarUrl: string,
    private readonly _publicFavoritesCount: number,
    private readonly _followingsCount: number
  ) {}

  get externalUserId() {
    return this._externalUserId;
  }
}
