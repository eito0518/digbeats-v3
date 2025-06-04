import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../auth/apiClient";

export const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // コールバックで認証情報を受け取り、バックエンドに渡す
    const handleAuthorizationCallback = async () => {
      // コールバックのパラメータから code, state を取得
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const returnedState = params.get("state");
      // セッションストレージから codeVerifier, state を取得
      const codeVerifier = sessionStorage.getItem("codeVerifier");
      const storedState = sessionStorage.getItem("state");

      // stateチェック（CSRF対策）
      if (returnedState !== storedState) {
        console.error("[Callback] State mismatch");
        // 再ログインを要求
        showLoginErrorAlert();
        navigate("/login");
        return;
      }

      // バリデーション
      if (!codeVerifier) {
        console.error("[Callback] codeVerifier does not exist");
        // 再ログインを要求
        showLoginErrorAlert();
        navigate("/login");
        return;
      } else if (!code) {
        console.error(
          "[Callback] code does not exist (SoundCloudAPI server error)"
        );
        // 再ログインを要求
        showLoginErrorAlert();
        navigate("/login");
        return;
      }

      // セッションストレージから認証情報を削除
      sessionStorage.removeItem("codeVerifier");
      sessionStorage.removeItem("state");

      try {
        // バックエンドに code + code_verifier を送信し、 Cookieで sessionId を自動取得
        await apiClient.post(
          "/auth/authorize",
          { code, codeVerifier },
          { withCredentials: true } // Cookieを受け取るために必要
        );

        // ホーム画面にリダイレクト
        navigate("/");
      } catch (error) {
        console.error("[Callback] Failed to callback: ", error);
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

const showLoginErrorAlert = () =>
  alert("Failed to login. Please try to login again.");
