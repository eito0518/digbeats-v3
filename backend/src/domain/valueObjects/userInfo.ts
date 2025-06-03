export class UserInfo {
  constructor(
    private readonly _externalUserId: number,
    private readonly _name: string,
    private readonly _avatarUrl: string,
    private readonly _permalinkUrl: string
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
}
