## 全体の流れ

### ログイン画面

- フロントで codeVerifier + codeChallemge, state 生成
- codeChallemge, state を含めた認可 URL を生成し、SoundCloud ログイン画面にリダイレクト
- コールバックで code, state を受け取り、state を検証
- 検証 OK であれば、バックエンドに codeVerifier, state を送信し、sessionId を受け取る。(ローカルの code, codeVerifier, state を削除)

### ホーム画面

- アーティストを検索できる（アーティストをフォロー・解除できる）
- レコメンドを取得できる（楽曲をいいね・解除できる）
- 「今日のレコメンド」が見れる（楽曲をいいね・解除できる）

### プロフィール画面

- ユーザーのプロフィールが見れる
- フォロ中のアーティスト一覧が見れる（アーティストをフォロー・解除できる）
- レコメンド履歴が見れる（楽曲をいいね・解除できる）

##　 API 設計

### POST /api/auth/authorize

- 説明：codeVerifier と code を送信する（Cookie に sessionId が返る）
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "codeVerifier": "ABCDEF",
  "code": "ABCDEF"
}
```

### GET /api/users/followings

- 説明：SoundCloud でフォロ中のアーティストを取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    "soundcloudArtistId": 12345,
    "name": "Travis Sccott",
    "avatarUrl": "https:~",
    "permalinkUrl": "https:~",
    "likedTracksCount": 123,
    "isFollowing": true
  }
  // ...
]
```

### GET /api/artists/`?artistName=Travis+Scott`

- 説明：SoundCloud でアーティストを検索する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    "soundcloudArtistId": 12345,
    "name": "Travis Sccott",
    "avatarUrl": "https:~",
    "permalinkUrl": "https:~",
    "likedTracksCount": 123,
    "isFollowing": false
  }
  // ...
]
```

### PUT /api/users/followings/:soundcloudArtistId

- 説明：SoundCloud でアーティストをフォローする
- 注意：ボタン連打の対策をする
- 認証：Cookie(sessionId)

### DELETE /api/users/followings/:soundcloudArtistId

- 説明：SoundCloud でアーティストのフォローを解除する
- 注意：ボタン連打の対策をする
- 認証：Cookie(sessionId)

### GET /api/recommendations

- 説明：楽曲レコメンドを取得する
- 注意：ユーザー情報の再配信は API ポリシー違反のため、レコメンドの出典がわからないようにする（最低５人以上はフォローさせる）
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  recomendationId: 12345(内部のID),
  "recommendedAt": "2025-04-18T10:00:00Z",
  tracks: [
    {
      "id": 12345(内部のID),
      "title": "FE!N",
      "artworkUrl": "https:~",
      "permalinkUrl": "https:~", // ウィジェット再生で使用
      "wasLiked": false,
      "artist": {
        "name": "Travis Sccott",
        "avatarUrl": "https:~",
        "permalinkUrl": "https:~",
      }
    },
    // ...
  ]
}
```

### GET /api/recommendations/today

- 説明：「今日のレコメンド」を最大３つまで取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  recommendations: [
    {
      "recomendationId": 12345(内部のID),
      "recommendedAt": "2025-04-18T10:00:00Z",
      "tracks": [
        {
          "id": 12345(内部の ID),
          "title": "FE!N",
          "artworkUrl": "https:~",
          "permalinkUrl": "https:~", // ウィジェット再生で使用
          "wasLiked": true,
          "artist": {
            "name": "Travis Sccott",
            "avatarUrl": "https:~",
            "permalinkUrl": "https:~",
          },
        },
        // ...
        ]
    },
    // ...
  ]
}
```

### GET /api/recommendations/historys

- 説明：楽曲レコメンド履歴を取得する
- 注意：履歴画面でのいいねの状態表示は DB の `wasLiked` のみを見る。SoundCloud 上の現状（今も like 中かどうか）は確認しない。
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    "recommendationId": 12345(内部のID),
    "recommendedAt": "2025-04-18T10:00:00Z",
    "tracks": [
        {
          "id": 12345(内部の ID),
          "title": "FE!N",
          "artworkUrl": "https:~",
          "permalinkUrl": "https:~", // ウィジェット再生で使用
          "wasLiked": true,
          "artist": {
            "name": "Travis Sccott",
            "avatarUrl": "https:~",
            "permalinkUrl": "https:~",
          },
        },
        // ...
        ]
  },
  // ...
]
```

### POST /api/likes/tracks

- 説明：楽曲のいいねを SoundCloud と DB に反映する
- 注意：ボタン連打の対策をする
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "trackId": 789(内部のtrackId)
}
```

### DELETE /api/likes/tracks

- 説明：楽曲のいいね解除を SoundCloud と DB に反映する
- 注意：ボタン連打の対策をする
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "trackId": 789(内部のtrackId)
}
```
