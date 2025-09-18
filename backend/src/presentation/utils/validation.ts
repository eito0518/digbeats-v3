import { ReauthenticationRequiredError } from "../../errors/application.errors";
import { BadRequestError } from "../../errors/presentation.errors";

// 認証情報 （code, codeVerifier） の存在チェック
export const validateAuthParams = (
  code: string,
  codeVerifier: string
): void => {
  if (!code || !codeVerifier) {
    throw new ReauthenticationRequiredError(
      "Authentication parameters are missing."
    );
  }
};

// sessionId の存在チェック
export const validateSessionId = (sessionId: string): void => {
  if (!sessionId) {
    throw new ReauthenticationRequiredError("Session ID is missing.");
  }
};

// artistName クエリパラメータの存在チェック と 文字変換
export const validateArtistNameParam = (artistNameRaw: unknown): string => {
  if (typeof artistNameRaw !== "string" || artistNameRaw.trim() === "") {
    throw new BadRequestError(
      "Invalid or missing 'artistName' query parameter"
    );
  }

  return decodeURIComponent(artistNameRaw);
};

// soundcloudArtistId の存在チェック と 数値変換
export const validateSoundCloudArtistId = (
  soundCloudArtistIdRaw: unknown
): number => {
  // 値が無い場合
  if (soundCloudArtistIdRaw === undefined || soundCloudArtistIdRaw === null) {
    throw new BadRequestError("Missing 'soundcloudArtistId'");
  }
  // 値が不正な数値の場合
  const soundCloudArtistId = Number(soundCloudArtistIdRaw);
  if (
    isNaN(soundCloudArtistId) ||
    !Number.isInteger(soundCloudArtistId) ||
    soundCloudArtistId <= 0
  ) {
    throw new BadRequestError(
      "'soundcloudArtistId' must be a positive integer"
    );
  }

  return soundCloudArtistId;
};

// いいね情報 （recommendationId, trackId） の存在チェック と 数値変換
export const validateLikeParams = (
  recommendationIdRaw: unknown,
  trackIdRaw: unknown
): { recommendationId: number; trackId: number } => {
  // recommendationIdの検証
  // 値が無い場合
  if (recommendationIdRaw === undefined || recommendationIdRaw === null) {
    throw new BadRequestError("Missing 'recommendationId'");
  }
  // 値が不正な数値の場合
  const recommendationId = Number(recommendationIdRaw);
  if (
    isNaN(recommendationId) ||
    !Number.isInteger(recommendationId) ||
    recommendationId <= 0
  ) {
    throw new BadRequestError("'recommendationId' must be a positive integer");
  }

  // trackIdの検証
  // 値が無い場合
  if (trackIdRaw === undefined || trackIdRaw === null) {
    throw new BadRequestError("Missing 'trackId'");
  }
  // 値が不正な数値の場合
  const trackId = Number(trackIdRaw);
  if (isNaN(trackId) || !Number.isInteger(trackId) || trackId <= 0) {
    throw new BadRequestError("'trackId' must be a positive integer");
  }

  return { recommendationId, trackId };
};
