## 認証・認可フロー概要

1. ユーザーがログインボタンをクリック
2. SoundCloud 認可画面へリダイレクト
3. 認可コード(code) + state がフロントに返却
4. フロントからバックエンドへ code + code_verifier を送信
5. バックエンドがアクセストークン取得
6. SoundCloud の /me エンドポイントでユーザー情報(soundcloud_userId)取得
7. DB にてユーザー存在チェック
   - 存在しなければ新規登録
8. セッション ID を発行し、Redis に保存
9. セッション ID を Cookie にセットしフロントへ返却

---

## ユースケース別動作

### 初回ログイン

- OAuth 認可後、DB にユーザー新規登録
- セッション保存

### セッション失効時 or リフレッシュトークン失効時

- 再度 OAuth 認可後、DB のユーザー情報と関連付け
- セッション保存

- (補足： リフレッシュトークンが切れていたら、結局「再認可（OAuth フロー再実行）」しか手段がないので、同じフローに統一する方がシンプルで保守性も高い)
