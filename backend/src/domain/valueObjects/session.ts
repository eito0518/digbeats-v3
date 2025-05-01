import { Token } from "./token";

export class Session {
  constructor(
    private readonly _userId: number,
    private readonly _token: Token,
    private readonly _createdAt: number
  ) {}

  get userId(): number {
    return this._userId;
  }

  get token(): Token {
    return this._token;
  }

  // Session型 から Object型 に変換
  toObject(): object {
    return {
      userId: this._userId,
      token: this._token,
      createdAt: this._createdAt,
    };
  }

  // JSON文字列 から Session型 に変換
  static fromJSON(jsonString: string): Session {
    const parsed = JSON.parse(jsonString); // JSON文字列をJSONオブジェクトに変換

    return new Session(
      parsed.userId,
      new Token(
        parsed.token.accessToken,
        parsed.token.accessTokenExpiresAt,
        parsed.token.refreshToken
      ),
      parsed.createdAt
    );
  }
}
