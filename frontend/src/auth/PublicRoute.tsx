import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

type Props = {
  children: React.JSX.Element;
};

// 認証済みのユーザーに画面を見せないようにする
export const PublicRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  // 認証済みの場合はアプリのホームに飛ばす
  if (isAuthenticated === true) return <Navigate to="/home" replace />;

  // 未認証の場合は子要素を表示
  return children;
};
