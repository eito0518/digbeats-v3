export interface GetTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface TokenRepository {
  getToken(code: string, codeVerifier: string): Promise<GetTokenResponse>;
}
