import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthorizationCallback = async () => {
      // params から code, state を取得
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const returnedState = params.get("state");
      // sessionStorage から codeVerifier, state を取得
      const codeVerifier = sessionStorage.getItem("codeVerifier");
      const storedState = sessionStorage.getItem("state");

      // stateチェック（CSRF対策）
      if (returnedState !== storedState) {
        throw new Error("State mismatch, unauthorized request");
      }

      // バリデーション
      if (!code || !codeVerifier) {
        throw new Error("Required information is missing");
      }

      try {
        // バックエンドに code + code_verifier を送信し、 Cookieで sessionId を自動取得
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        await axios.post(
          `${API_BASE_URL}/api/auth/exchange`,
          {
            code: code,
            codeVerifier: codeVerifier,
          },
          {
            withCredentials: true, // Cookieを受け取るために必要
          }
        );

        // ルートディレクトリにリダイレクト
        navigate("/");
      } catch (error) {
        console.error("ログイン失敗", error);
        alert("ログインに失敗しました。もう一度お試しください。");
        throw new Error("Failed to login");
      }
    };

    handleAuthorizationCallback();
  }, []); // SoundCloudからのコールバック時に実行

  return <p>ログイン処理中です...</p>;
};
