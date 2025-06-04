import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from "./generatePkce";

// OAuth認証URLを生成する
export const generateAuthorizationUrl = async () => {
  // 生成に必要な情報を取得
  const clientId = import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SOUNDCLOUD_REDIRECT_URI;
  const responseType = "code";
  const codeVerifier = generateCodeVerifier();
  const codeChallengeMethod = "S256";
  const codeChallenge = await generateCodeChallenge(
    codeVerifier,
    codeChallengeMethod
  );
  const state = generateState();

  // セッションストレージ に code_verifier, state を一時保存 （コールバック時に照合するため）
  sessionStorage.setItem("codeVerifier", codeVerifier);
  sessionStorage.setItem("state", state);

  // OAuth認証URLを生成
  const url = new URL("https://secure.soundcloud.com/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", responseType);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", codeChallengeMethod);
  url.searchParams.set("state", state);

  return url.toString();
};
