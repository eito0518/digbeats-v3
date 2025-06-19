import { useEffect, useState } from "react";
import { apiClient } from "./apiClient";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // ユーザーがセッション中かどうかを判断する
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // APIでセッションの有無を確認
        await apiClient.get("/auth/session", { withCredentials: true });
        // 成功した場合は認証済み
        setIsAuthenticated(true);
      } catch (error) {
        // 失敗した場合は未認証
        console.log("[useAuth] Session expired");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  return { isAuthenticated, isLoading };
};
