import { Response } from "express";
import { REAUTH_REQUIRED } from "../../constants/errorCodes";

// 認証情報 （code, codeVerifier） の存在チェック
export const validateAuthParams = (
  code: string,
  codeVerifier: string,
  res: Response
): boolean => {
  if (!code || !codeVerifier) {
    res.status(401).json({ message: REAUTH_REQUIRED });
    return false;
  }
  return true;
};

// sessionId の存在チェック
export const validateSessionId = (
  sessionId: string,
  res: Response
): boolean => {
  if (!sessionId) {
    res.status(401).json({ message: REAUTH_REQUIRED });
    return false;
  }
  return true;
};

// soundcloudArtistId パラメータの存在チェック と 数値変換
export const validateSoundCloudArtistIdParam = (
  soundcloudArtistIdRaw: string,
  res: Response
): number | undefined => {
  if (!soundcloudArtistIdRaw) {
    res.status(400).json({ error: "Missing 'soundcloudArtistId' parameter" });
    return;
  }

  const soundcloudArtistId = Number(decodeURIComponent(soundcloudArtistIdRaw));

  if (Number.isNaN(soundcloudArtistId)) {
    res
      .status(400)
      .json({ error: "'soundcloudArtistId' must be a valid number" });
    return;
  }

  return soundcloudArtistId;
};
