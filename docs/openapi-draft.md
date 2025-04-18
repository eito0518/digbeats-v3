## 一連のアクション

### ログイン

- フロントで codeVerifier + codeChallemge, state 生成
- codeChallemge, state を含めた認可 URL を生成し、SoundCloud ログイン画面にリダイレクト
- コールバックで code, state を受け取り、state を検証
- 検証 OK であれば、バックエンドに codeVerifier, state を送信し、sessionId を受け取る。(ローカルの code, codeVerifier, state を削除)

### ホーム

- フォロ中のアーティスト一覧が見れる
- アーティストを検索して、フォローできる
- レコメンドを取得できる
- レコメンド履歴が見れる

##　 API 設計

### POST /api/auth

- 説明：codeVerifier と code を送信する（Cookie に sessionId が返る）
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
    codeVerifier: ABCDEF,
    code: ABCDEF,
}
```

### GET /api/users/following

- 説明：フォロ中のアーティストを取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    name: travis sccott,
    avatar_url: https:~,
    public_favorites_count: 123,
    permalink_url: https:~,
  },
  ...
]
```

### GET /api/artists/?name=travis+scott

- 説明：アーティストを取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    name: travis sccott,
    avatar_url: https:~,
    public_favorites_count: 123,
    permalink_ural: https:~,
  },
  ...
]
```

### PUT /api/users/following/:artists_id

- 説明：アーティストをフォローする
- 認証：Cookie(sessionId)
- レスポンス：

### GET /api/recommendations

- 説明：レコメンドを取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  { // APIで曲を再生する場合 (利用規約に注意)
    track_title: FE!N,
    artwork_url: https:~,
    track_permalink_url: https:~,
    artist_name: travis sccott,
    avatar_url: https:~,
    artist_permalink_url: https:~,
    // ウィジェットで曲を再生する場合
    widget_url: https:~,
  },
  ...
]
```

### GET /api/recommendations/history

- 説明：レコメンド履歴を取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    recommended_at: "2025-04-18T10:00:00Z",
    tracks: [
      {
      // ウィジェットで曲を再生する場合
      widget_url: https:~,
      }
    ]
  },
  ...
]
```
