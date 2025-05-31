import { TokenRepository } from "../../domain/interfaces/tokenRepository";
import { Token } from "../../domain/valueObjects/token";
import url from "url";
import { config } from "../../config/config";
import axios from "axios";

export class TokenSoundCloudRepository implements TokenRepository {
  // トークンを取得する
  async getToken(code: string, codeVerifier: string): Promise<Token> {
    const tokenUrl = "https://secure.soundcloud.com/oauth/token";
    const params = new url.URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", config.CLIENT_ID);
    params.append("client_secret", config.CLIENT_SECRET);
    params.append("redirect_uri", config.REDIRECT_URI);
    params.append("code_verifier", codeVerifier);
    params.append("code", code);

    try {
      const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          accept: "application/json; charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return Token.fromExpiresIn(
        response.data.access_token,
        response.data.expires_in,
        response.data.refresh_token
      );
    } catch (error) {
      const message =
        "Failed to fetch token: unable to communicate with SoundCloud OAuth server";
      console.error(`[tokenSoundCloudRepository] ${message}`, error);
      throw new Error(message);
    }
  }

  // トークンを更新する
  async refresh(refreshToken: string): Promise<Token> {
    const tokenUrl = "https://secure.soundcloud.com/oauth/token";
    const params = new url.URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", config.CLIENT_ID);
    params.append("client_secret", config.CLIENT_SECRET);
    params.append("refresh_token", refreshToken);

    try {
      const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          accept: "application/json; charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return Token.fromExpiresIn(
        response.data.access_token,
        response.data.expires_in,
        response.data.refresh_token
      );
    } catch (error) {
      const message =
        "Failed to refresh token: unable to communicate with SoundCloud OAuth server";
      console.error(`[tokenSoundCloudRepository] ${message}`, error);
      throw new Error(message);
    }
  }
}
