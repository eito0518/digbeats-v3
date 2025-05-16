## 認証フロー概要

### フロントエンド

1. ユーザーがログインボタンをクリック
2. codeVerifier + codeChallenge (PKCE) と state を生成し、セッションストレージに保存
3. codeChallenge, state を使って認可 URL を生成し、SoundCloud 認可画面へリダイレクト
4. コールバックで code(認可コード), state がフロントエンドに返却
5. state を検証
6. フロントエンドからバックエンドへ code, codeVerifier を送信
7. フロントエンドはセッションストレージに保存されている codeVerifier, state を削除

### バックエンド

8. バックエンドが code, codeVerifier を用いて トークン (accessToken, expiresIn, refreshToken)を取得
9. SoundCloud の /me エンドポイントでユーザー情報(soundcloudUserId)取得
10. DB にユーザーが既に登録されているか確認
    - 存在しなければ新規登録
11. セッション ID を発行し、トークン と soundcloud_userId を Redis に保存
12. セッション ID を Cookie にセットしフロントエンドへ返却

---

## ユースケース別動作

### 初回ログイン

- OAuth 認可後、DB にユーザー新規登録
- 新しくセッションを発行

### セッション失効時 or リフレッシュトークン失効時

- 再度 OAuth 認可後、DB のユーザー情報と関連付け
- 新しくセッションを発行

- (補足： リフレッシュトークンが切れていたら、結局「再認可（OAuth フロー再実行）」しか手段がないので、同じフローに統一する方がシンプル)
