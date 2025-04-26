export class TokenService {
  static async getAccessTokenExpiresAt(expiresIn: number): Promise<number> {
    const safeTime = 60 * 1000; // アクセストークン失効直前のアクセス対策 （ミリ秒で設定）
    return Date.now() + expiresIn * 1000 - safeTime;
  }
}
