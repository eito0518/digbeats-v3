import { generateAuthorizationUrl } from "./generateAuthorizationUrl";

export const Login = () => {
  const handleLogin = async () => {
    // セッションをクリアする
    sessionStorage.clear();
    // ログイン用URL生成
    const authorizationUrl = await generateAuthorizationUrl();
    // ログインページにリダイレクト
    window.location.href = authorizationUrl;
  };

  return (
    <>
      <h1>ログイン画面</h1>
      <button onClick={handleLogin}>SoundCloudでログイン</button>
    </>
  );
};
