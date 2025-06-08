export class Token {
  constructor(
    private readonly _accessToken: string,
    private readonly _accessTokenExpiresAt: number,
    private readonly _refreshToken: string
  ) {}

  get accessToken(): string {
    return this._accessToken;
  }

  get accessTokenExpiresAt(): number {
    return this._accessTokenExpiresAt;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  isAccessTokenExpired(): boolean {
    return Date.now() > this._accessTokenExpiresAt;
  }

  // expiresInオブジェクト　から　Token型(expiresAt)に変換
  static fromExpiresIn(
    accessToken: string,
    expiresIn: number,
    refreshToken: string
  ): Token {
    const safeTime = 60; // アクセストークン失効直前のアクセス対策
    const accessTokenExpiresAt = Date.now() + (expiresIn - safeTime) * 1000; // ミリ秒で設定
    return new Token(accessToken, accessTokenExpiresAt, refreshToken);
  }
}
