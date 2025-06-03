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

// artistName クエリパラメータの存在チェック と 文字変換
export const validateArtistNameParam = (
  artistNameRaw: unknown,
  res: Response
): string | undefined => {
  if (typeof artistNameRaw !== "string" || artistNameRaw.trim() === "") {
    res
      .status(400)
      .json({ error: "Invalid or missing 'artistName' query parameter" });
    return;
  }

  return decodeURIComponent(artistNameRaw);
};

// soundcloudArtistId の存在チェック と 数値変換
export const validateSoundCloudArtistId = (
  soundCloudArtistIdRaw: unknown,
  res: Response
): number | undefined => {
  // 値が無い場合
  if (soundCloudArtistIdRaw === undefined || soundCloudArtistIdRaw === null) {
    res.status(400).json({ error: "Missing 'soundcloudArtistId'" });
    return;
  }
  // 値が不正な数値の場合
  const soundCloudArtistId = Number(soundCloudArtistIdRaw);
  if (
    isNaN(soundCloudArtistId) ||
    !Number.isInteger(soundCloudArtistId) ||
    soundCloudArtistId <= 0
  ) {
    res
      .status(400)
      .json({ error: "'soundcloudArtistId' must be a positive integer" });
    return;
  }

  return soundCloudArtistId;
};

// いいね情報 （recommendationId, trackId） の存在チェック と 数値変換
export const validateLikeParams = (
  recommendationIdRaw: unknown,
  trackIdRaw: unknown,
  res: Response
): { recommendationId: number; trackId: number } | undefined => {
  // 値が無い場合
  if (recommendationIdRaw === undefined || recommendationIdRaw === null) {
    res.status(400).json({ error: "Missing 'recommendationId'" });
    return;
  } else if (trackIdRaw === undefined || trackIdRaw === null) {
    res.status(400).json({ error: "Missing 'trackId'" });
    return;
  }
  // 値が不正な数値の場合
  const recommendationId = Number(recommendationIdRaw);
  const trackId = Number(trackIdRaw);
  if (
    isNaN(recommendationId) ||
    !Number.isInteger(recommendationId) ||
    recommendationId <= 0
  ) {
    res
      .status(400)
      .json({ error: "'recommendationId' must be a positive integer" });
    return;
  } else if (isNaN(trackId) || !Number.isInteger(trackId) || trackId <= 0) {
    res.status(400).json({ error: "'trackId' must be a positive integer" });
    return;
  }

  return { recommendationId, trackId };
};
