// session にどんなデータを保存するか定義
export interface SessionData {
  userId: number;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  createdAt: number;
}

//　実装クラスでどんなメソッドを実装するか定義
export interface SessionRepository {
  save(sessionId: string, sessionData: SessionData): Promise<void>;
}
