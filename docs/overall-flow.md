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

### GET /api/users

- 説明： 自身のプロフィール情報を SoundCloud で取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  "user": {
    "name": "User1",
    "avatarUrl": "https:~",
    "permalinkUrl": "https:~"
  }
}
```

### GET /api/users/followings

- 説明： フォロ中のアーティストを SoundCloud で取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  "artists": [
    {
      "soundcloudArtistId": 12345,
      "name": "Travis Sccott",
      "avatarUrl": "https:~",
      "permalinkUrl": "https:~",
      "likedTracksCount": 123
    }
    // ...
  ]
}
```

### GET /api/artists/search`?artistName=Travis+Scott`

- 説明：アーティストを SoundCloud で検索する
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  "artists": [
    {
      "soundcloudArtistId": 12345,
      "name": "Travis Sccott",
      "avatarUrl": "https:~",
      "permalinkUrl": "https:~",
      "likedTracksCount": 123
    }
    // ...
  ]
}
```

### POST /api/users/followings

- 説明：アーティストを SoundCloud でフォローする
- 注意：ボタン連打の対策をする
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "soundcloudArtistId": 23(外部のartistsId)
}
```

### DELETE /api/users/followings

- 説明：アーティストを SoundCloud でフォロー解除する
- 注意：ボタン連打の対策をする
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "soundcloudArtistId": 24(外部のartistsId)
}
```

### GET /api/recommendations

- 説明：楽曲レコメンドを取得する
- 注意：ユーザー情報の再配信は API ポリシー違反のため、レコメンドの出典がわからないようにする（最低５人以上はフォローさせる）
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  "recommendation": {
    "recommendationId": 12345(内部のID),
    "recommendedAt": "2025-04-18T10:00:00Z",
    "tracks": [
      {
        "id": 12345(内部のID),
        "title": "FE!N",
        "artworkUrl": "https:~",
        "permalinkUrl": "https:~", // ウィジェット再生で使用
        "artist": {
          "name": "Travis Sccott",
          "avatarUrl": "https:~",
          "permalinkUrl": "https:~",
        }
      },
      // ...
    ]
  }
}
```

### GET /api/recommendations/today

- 説明：「今日のレコメンド」を最大３つまで取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  "recommendations": [
    {
      "recommendationId": 12345(内部のID),
      "recommendedAt": "2025-04-18T10:00:00Z",
      "tracks": [
        {
          "id": 12345(内部の ID),
          "title": "FE!N",
          "artworkUrl": "https:~",
          "permalinkUrl": "https:~", // ウィジェット再生で使用
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

### GET /api/recommendations/histories

- 説明：楽曲レコメンド履歴を取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  "histories": [
    {
      "recommendationId": 12345(内部のID),
      "recommendedAt": "2025-04-18T10:00:00Z",
      "tracks": [
        {
          "id": 12345(内部の ID),
          "title": "FE!N",
          "artworkUrl": "https:~",
          "permalinkUrl": "https:~", // ウィジェット再生で使用
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

### GET /api/users/likes

- 説明：いいね中の楽曲 ID を SoundCloud で取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  "soundcloudTrackIds": [
    12345,
    23512,
    31231 // SoundCloudの trackID
  ]
}
```

### POST /api/users/likes

- 説明：楽曲のいいねを SoundCloud と DB に反映する
- 注意：ボタン連打の対策をする
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "recommendationId": 4324,
  "trackId": 789(内部のtrackId)
}
```

### DELETE /api/users/likes

- 説明：楽曲のいいね解除を SoundCloud と DB に反映する
- 注意：ボタン連打の対策をする
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "recommendationId": 4324,
  "trackId": 789(内部のtrackId)
}
```

### いいねについて

- フロントエンドでのいいね状態は、常に SoundCloud 上の情報を参照する
- ただし、ユーザーがアプリ上で行った「いいね／いいね解除」の操作は、 SoundCloud API に即時反映し、加えて、アプリ内ログとして `isLikedInApp` に記録する
  ※ただし、このログは SoundCloud 本体で行われた状態変更とは同期させず、ユーザーがアプリ上で行った操作のみを反映させる
