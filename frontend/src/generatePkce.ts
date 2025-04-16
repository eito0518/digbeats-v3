// codeVerifierを生成（ランダムな文字列）
export const generateCodeVerifier = (length = 64): string => {
  if (length < 43 || length > 128) {
    throw new Error("code_verifier must be between 43 and 128 characters");
  }

  const randomValues = new Uint8Array(length); // 0〜255の整数(初期値0)がlength個だけ入る配列（8byteだから0〜255）
  crypto.getRandomValues(randomValues); // 各要素を0〜255のランダムな整数にする

  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  const codeVerifier = Array.from(randomValues) // uint8Array型から普通の配列に変換
    .map((value: number): string => charset.charAt(value % charset.length)) // 整数配列から文字配列に変換
    .join(""); // 文字配列を１つの文字列に結合;

  return codeVerifier;
};

// codeChallengeを生成
export const generateCodeChallenge = async (
  codeVerifier: string,
  codeChallengeMethod: "S256" | "plain" = "S256"
): Promise<string> => {
  if (codeChallengeMethod === "plain") {
    return codeVerifier;
  }

  if (codeChallengeMethod !== "S256") {
    throw new Error("Only 'S256' and 'plain' methods are supported");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier); // 文字型からArrayBuffer型に変換
  const digest = await crypto.subtle.digest("SHA-256", data); // SHA-256でダイジェストを生成

  return base64urlEncode(digest); // Base64URLに変換
};

// stateを生成
export const generateState = (): string => {
  const randomValues = new Uint8Array(32); // 0〜255の整数(初期値0)がlength個だけ入る配列（8byteだから0〜255）
  crypto.getRandomValues(randomValues); // 各要素を0〜255のランダムな整数にする

  const state = Array.from(randomValues) // uint8Array型から普通の配列に変換
    .map((value: number): string => value.toString(16).padStart(2, "0")) // 0〜255の整数を16進数で表現(文字型)、有効数字２桁
    .join("");

  return state;
};

// Base64URLに変換する関数
function base64urlEncode(arrayBuffer: ArrayBuffer): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  const base64url = base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return base64url;
}
