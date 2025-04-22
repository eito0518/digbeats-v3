import express from "express";
import axios from "axios";
import morgan from "morgan";
import dotenv from "dotenv";
import Redis from "ioredis";
import url from "url";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
import cors from "cors";
import https from "https";
import fs from "fs";
import { asyncHandler } from "./middleware/asyncHandler";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://localhost:3000", // フロントエンドのURL　（https コールバックのため）
    credentials: true, // Cookieを許可
  })
);

const redis = new Redis();
const key = fs.readFileSync("../cert/localhost-key.pem");
const cert = fs.readFileSync("../cert/localhost.pem");

const SOUNDCLOUD_API_BASE_URL = process.env.SOUNDCLOUD_API_BASE_URL;

// アクセストークンを取得し sessionId を Cookieに保存するAPI
app.post(
  "/api/auth/exchange",
  asyncHandler(async (req, res) => {
    // reqから取得
    const code = req.body.code;
    const codeVerifier = req.body.codeVerifier;
    // .env, .env.localから取得
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    // バリデーション
    if (!code || !codeVerifier || !clientId || !clientSecret || !redirectUri) {
      throw new Error("Required params is missing");
    }

    // アクセストークンを取得
    const tokenUrl = "https://secure.soundcloud.com/oauth/token";
    const params = new url.URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("redirect_uri", redirectUri);
    params.append("code_verifier", codeVerifier);
    params.append("code", code);

    let response;
    try {
      response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          accept: "application/json; charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    } catch (error: any) {
      console.error("token request failed:", error);
      return res.status(500).json({ message: "Token request failed" });
    }

    // sessionId発行
    const sessionId = uuidv4();

    // redis に保存
    const refreshTokenTTL = 60 * 60 * 24 * 2; // 2日間
    const safeTime = 60 * 1000; // アクセストークン失効直前のアクセス対策 （ミリ秒で設定）
    await redis.set(
      `session: ${sessionId}`,
      JSON.stringify({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        accessTokenExpiresAt:
          Date.now() + response.data.expires_in * 1000 - safeTime,
        createdAt: Date.now(),
      }),
      "EX",
      refreshTokenTTL // sessionTTL は refreshTokenTTL に設定
    );

    // sessionId を Cookie　に保存
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SECURE === "true" ? "none" : "lax",
        maxAge: refreshTokenTTL * 1000 - safeTime,
      })
      .status(200)
      .json({
        message: "Session cookie set",
        expiredAt: Date.now() + refreshTokenTTL * 1000 - safeTime,
      });
  })
);

// フォローしているアーティストを取得するAPI
app.get(
  "/api/me/followings",
  asyncHandler(async (req, res) => {
    console.log("🔵 /api/me/followings HIT"); /////////////

    // sessionIdでユーザーを認識
    const returnedSessionId = req.cookies.sessionId;
    // バリデーション
    if (!returnedSessionId) {
      console.log("❌ No sessionId found"); /////////////
      return res.status(401).json({ message: "SessionId not found" });
    }

    // 指定された　session　を取得
    const session = await redis.get(`session: ${returnedSessionId}`);

    // session が生きているか調べる (リフレッシュトークンの期限切れじゃないか)
    if (!session) {
      return res.status(401).json({
        message: "Session expired. Please login again.",
        code: "REAUTH_REQUIRED",
      });
    }

    console.log("✅ Session found:"); /////////////

    // アクセストークンが生きてない場合はリフレッシュトークンで更新
    const { accessToken, refreshToken, accessTokenExpiresAt } =
      JSON.parse(session);

    if (Date.now() > accessTokenExpiresAt) {
      const clientId = process.env.CLIENT_ID;
      const clientSecret = process.env.CLIENT_SECRET;
      // バリデーション
      if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Required params is missing");
      }
      // トークンを再取得
      const tokenUrl = "https://secure.soundcloud.com/oauth/token";
      const params = new url.URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);
      params.append("efresh_token", refreshToken);

      try {
        const response = await axios.post(tokenUrl, params.toString(), {
          headers: {
            accept: "application/json; charset=utf-8",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        // 再取得成功したらアクセストークン更新　（session更新）
        const safeTime = 60 * 1000; // アクセストークン失効直前のアクセス対策 （ミリ秒で設定）
        await redis.set(
          `session: ${returnedSessionId}`,
          JSON.stringify({
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            accessTokenExpiresAt:
              Date.now() + response.data.expires_in * 1000 - safeTime,
            createdAt: Date.now(),
          }),
          "EX",
          response.data.expires_in // リフレッシュトークンを使ったのでアクセストークンの時間を設定
        );
      } catch (error) {
        // リフレッシュトークンが失効していたら（なんらかのエラー）
        res.clearCookie("sessionId"); // sessionIdって名前を他のアプリが使っていてかぶるかも？
        return res.status(401).json({
          message: "Token refresh failed. Please log in again.",
          code: "REAUTH_REQUIRED",
        });
      }
    }

    // アクセストークンが生きてる場合 (or 再取得後)
    //　SoundCloudAPIでフォロー中のユーザー(アーティスト)を取得
    try {
      const response = await axios.get(
        `${SOUNDCLOUD_API_BASE_URL}/me/followings`,
        {
          headers: {
            accept: "application/json; charset=utf-8",
            Authorization: `OAuth ${accessToken}`,
          },
          params: { limit: 10 },
        }
      );

      const users = response.data.collection.map((user: any) => ({
        id: user.id,
        username: user.username,
        publicFavoritesCount: user.public_favorites_count,
      }));

      return res.status(200).json({
        users: users,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Not found following users",
      });
    }
  })
);

// アーティストのいいね曲を１つ取得するAPI
app.get(
  "/api/users/:artistId/likes/tracks",
  asyncHandler(async (req, res) => {
    // sessionIdでユーザーを認識
    const returnedSessionId = req.cookies.sessionId;
    // バリデーション
    if (!returnedSessionId) {
      throw new Error("SessionId not found");
    }

    // 指定された　session　を取得
    const session = await redis.get(`session: ${returnedSessionId}`);

    // session が生きているか調べる (リフレッシュトークンの期限切れじゃないか)
    if (!session) {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
        code: "REAUTH_REQUIRED",
      });
    }

    // アクセストークンが生きてない場合はリフレッシュトークンで更新
    const { accessToken, refreshToken, accessTokenExpiresAt } =
      JSON.parse(session);

    if (Date.now() > accessTokenExpiresAt) {
      const clientId = process.env.CLIENT_ID;
      const clientSecret = process.env.CLIENT_SECRET;
      // バリデーション
      if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Required params is missing");
      }
      // トークンを再取得
      const tokenUrl = "https://secure.soundcloud.com/oauth/token";
      const params = new url.URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);
      params.append("efresh_token", refreshToken);

      try {
        const response = await axios.post(tokenUrl, params.toString(), {
          headers: {
            accept: "application/json; charset=utf-8",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        // 再取得成功したらアクセストークン更新　（session更新）
        const safeTime = 60 * 1000; // アクセストークン失効直前のアクセス対策 （ミリ秒で設定）
        await redis.set(
          `session: ${returnedSessionId}`,
          JSON.stringify({
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            accessTokenExpiresAt:
              Date.now() + response.data.expires_in * 1000 - safeTime,
            createdAt: Date.now(),
          }),
          "EX",
          response.data.expires_in // リフレッシュトークンを使ったのでアクセストークンの時間を設定
        );
      } catch (error) {
        // リフレッシュトークンが失効していたら（なんらかのエラー）
        res.clearCookie("sessionId"); // sessionIdって名前を他のアプリが使っていてかぶるかも？
        return res.status(401).json({
          message: "Token refresh failed. Please log in again.",
          code: "REAUTH_REQUIRED",
        });
      }
    }

    // アクセストークンが生きてる場合 (or 再取得後)
    //　SoundCloudAPIでユーザー（アーティスト）のいいね曲を１つ取得
    const artistId = req.params.artistId;
    try {
      const response = await axios.get(
        `${SOUNDCLOUD_API_BASE_URL}/users/${artistId}/likes/tracks`,
        {
          headers: {
            accept: "application/json; charset=utf-8",
            Authorization: `OAuth ${accessToken}`,
          },
          params: { limit: 1 },
        }
      );

      console.log("✅ track取得成功:");

      const tracks = response.data.map((track: any) => ({
        id: track.id,
        title: track.title,
        artworkUrl: track.artwork_url,
      }));

      return res.status(200).json({
        tracks: tracks,
      });
    } catch (error: any) {
      console.error("❌ track取得失敗:", error.response?.data || error.message);
      return res.status(404).json({
        message: "Not found following users",
      });
    }
  })
);

app.use(errorHandler);

https.createServer({ key, cert }, app).listen(process.env.PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${process.env.PORT}`);
});
