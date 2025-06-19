import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

type Props = {
  children: React.JSX.Element;
};

// 未認証のユーザーに画面を見せないようにする
export const PrivateRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  // 未認証の場合はログインページに飛ばす
  if (isAuthenticated === false) return <Navigate to="/login" replace />;

  // 認証済みの場合は子要素を表示
  return children;
};
