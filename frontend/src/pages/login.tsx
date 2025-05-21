import { useEffect } from "react";
import { generateAuthorizationUrl } from "../auth/generateAuthorizationUrl";
import logo from "../assets/digbeats-logo.png";

export const Login = () => {
  // マウント時に古いPKCE情報を削除
  useEffect(() => {
    sessionStorage.removeItem("codeVerifier");
    sessionStorage.removeItem("state");
  }, []);

  const handleLogin = async () => {
    // ログイン用URL生成
    const authorizationUrl = await generateAuthorizationUrl();
    // ログインページにリダイレクト
    window.location.href = authorizationUrl;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      {/* ロゴ */}
      <img src={logo} alt="DigBeats Logo" className="w-24 h-24" />

      {/* キャッチコピー */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10 leading-snug">
        Hear what they like.
        <br />
        Find what you'll love.
      </h1>

      {/* ボタン */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={handleLogin}
          className="bg-orange-400 text-black font-semibold py-3 rounded-full hover:bg-orange-400"
        >
          Create an account
        </button>
        <button
          onClick={handleLogin}
          className="bg-black text-white font-semibold py-3 rounded-full border border-white hover:bg-white hover:text-black transition"
        >
          Log in
        </button>
      </div>
    </div>
  );
};
