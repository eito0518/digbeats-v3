import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../auth/apiClient";

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

      // セッションストレージから認証情報を削除
      sessionStorage.removeItem("codeVerifier");
      sessionStorage.removeItem("state");

      try {
        // バックエンドに code + code_verifier を送信し、 Cookieで sessionId を自動取得
        await apiClient.post(
          "/auth/authorize",
          {
            code: code,
            codeVerifier: codeVerifier,
          },
          {
            withCredentials: true, // Cookieを受け取るために必要
          }
        );

        // ホーム画面にリダイレクト
        navigate("/");
      } catch (error) {
        console.error("failed to login ", error);
        alert("ログインに失敗しました。もう一度お試しください。");
        throw new Error("Failed to login");
      }
    };

    handleAuthorizationCallback();
  }, []); // SoundCloudからのコールバック時に実行

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="flex flex-col items-center">
        {/* ローディングスピナー */}
        <div className="w-12 h-12 border-[6px] border-white border-t-transparent rounded-full animate-spin" />
        {/* メッセージ */}
        <p className="text-sm font-semibold text-gray-300 mt-6">
          Logging in...
        </p>
      </div>
    </div>
  );
};
