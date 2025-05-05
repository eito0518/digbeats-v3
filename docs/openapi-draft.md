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

### POST /api/auth/authorize

- 説明：codeVerifier と code を送信する（Cookie に sessionId が返る）
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
    codeVerifier: ABCDEF,
    code: ABCDEF,
}
```

### GET /api/users/followings

- 説明：SoundCloud でフォロ中のアーティストを取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    soundcloudArtistId: 12345
    name: Travis Sccott,
    avatarUrl: https:~,
    publicFavoritesCount: 123,
    permalinkUrl: https:~,
  },
  ...
]
```

### GET /api/artists/`?artistName=Travis+Scott`

- 説明：SoundCloud でアーティストを検索する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    soundcloudArtistId: 12345
    name: Travis Sccott,
    avatarUrl: https:~,
    publicFavoritesCount: 123,
    permalinkUrl: https:~,
  },
  ...
]
```

### PUT /api/users/followings/:soundcloudArtistId

- 説明：SoundCloud でアーティストをフォローする
- 認証：Cookie(sessionId)

### GET /api/recommendations

- 説明：楽曲レコメンドを取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  { // SoundCloud APIで曲を再生する場合 (APIポリシーに注意)
    trackTitle: FE!N,
    artworkUrl: https:~,
    trackPermalinkUrl: https:~,
    artistName: Travis Sccott,
    avatarUrl: https:~,
    artistPermalinkUrl: https:~,
    // ウィジェットで曲を再生する場合
    widgetUrl: https:~,
  },
  ...
]
```

### GET /api/recommendations/historys

- 説明：楽曲レコメンド履歴を取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    recommended_at: "2025-04-18T10:00:00Z",
    tracks: [
      {
      // ウィジェットで曲を再生する場合
      widgetUrl: https:~,
      }
    ]
  },
  ...
]
```
