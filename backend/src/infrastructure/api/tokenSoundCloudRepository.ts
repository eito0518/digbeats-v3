import {
  TokenRepository,
  GetTokenResponse,
} from "../../domain/interfaces/tokenRepository";
import url from "url";
import { config } from "../../config/config";
import axios from "axios";

export class TokenSoundCloudRepository implements TokenRepository {
  // アクセストークンを取得
  async getToken(
    code: string,
    codeVerifier: string
  ): Promise<GetTokenResponse> {
    const tokenUrl = "https://secure.soundcloud.com/oauth/token";
    const params = new url.URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", config.clientId);
    params.append("client_secret", config.clientSecret);
    params.append("redirect_uri", config.redirectUri);
    params.append("code_verifier", codeVerifier);
    params.append("code", code);

    try {
      const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          accept: "application/json; charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      console.error("token request failed:", error);
      throw new Error("Token request failed");
    }
  }
}
