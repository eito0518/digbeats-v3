import { Token } from "../valueObjects/token";

export interface TokenRepository {
  getToken(code: string, codeVerifier: string): Promise<Token>;
  refresh(refreshToken: string): Promise<Token>;
}
