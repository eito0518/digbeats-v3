import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiClient } from "../auth/apiClient";

type Props = {
  children: React.JSX.Element;
};

export const RequireSession = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // ログイン中かどうかを判定する
    const checkSession = async () => {
      try {
        await apiClient.get("/auth/session", { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  if (isAuthenticated === null) return null; // ローディング中など
  if (isAuthenticated === false) return <Navigate to="/login" replace />;
  return children;
};
