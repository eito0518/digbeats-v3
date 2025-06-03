import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Cookieを許可
});

// 共通のレスポンスエラーハンドリング
apiClient.interceptors.response.use(
  (response) => response, // 通信が成功したらそのまま返す
  (error) => {
    // 通信が失敗した時は条件で処理を分岐
    const response = error.response;
    if (
      response?.status === 401 &&
      response?.data?.message === "REAUTH_REQUIRED"
    ) {
      console.warn("Session expired. Redirecting to Login Page");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
