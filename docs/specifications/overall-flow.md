## 全体の流れ

### ログイン画面

- フロントで codeVerifier + codeChallemge, state 生成
- codeChallemge, state を含めた認可 URL を生成し、SoundCloud ログイン画面にリダイレクト
- コールバックで code, state を受け取り、state を検証
- 検証 OK であれば、バックエンドに codeVerifier, state を送信し、sessionId を受け取る。(ローカルの code, codeVerifier, state を削除)

### ホーム画面

- アーティストを検索できる（アーティストをフォロー・解除できる）
- レコメンドを取得できる（楽曲をいいね・解除できる）
- 「今日のレコメンド」が見れる（楽曲が再生できる、楽曲をいいね・解除できる）
- プロフィール画面に移動できる

### プロフィール画面

- ユーザーのプロフィールが見れる
- フォロ中のアーティスト一覧が見れる（アーティストをフォロー・解除できる）
- レコメンド履歴が見れる（楽曲が再生できる、楽曲をいいね・解除できる）
- ホーム画面に戻れる

### 楽曲いいねについて

- アプリケーション内での「いいね」の状態は、**内部データベースの`recommendations_tracks`テーブルにある`is_liked`フラグを唯一の信頼できる情報源とする。**
- フロントエンドは、ページの初期表示時に API から取得した各トラックの`isLiked`プロパティに従って、「いいね」の初期状態を表示する。
- ユーザーがアプリ内で「いいね／いいね解除」の操作を行った場合、バックエンドは以下の 2 つの処理を実行する。
  1.  **内部データベースの`is_liked`フラグを更新する（`true`または`false`に）。**
  2.  SoundCloud API を呼び出し、SoundCloud 本体の「いいね」状態も同様に更新する（これは、あくまで外部サービスとの同期を試みるための処理）。
- SoundCloud 本体の Web サイトや他のアプリで行われた「いいね」状態の変更は、このアプリケーションの表示には**反映されない**。

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

### GET /api/auth/session

- 説明：フロントエンドの Cookie に sessionId がセットされているか確認し、ログイン状態を判定する（初回アクセス時のログイン画面遷移に用いる）
- 認証：Cookie(sessionId)

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

### POST /api/users/followings

- 説明：アーティストを SoundCloud でフォローする
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "soundcloudArtistId": 23(外部のartistsId)
}
```

### DELETE /api/users/followings

- 説明：アーティストを SoundCloud でフォロー解除する
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "soundcloudArtistId": 24(外部のartistsId)
}
```

### POST /api/users/likes

- 説明：楽曲のいいねを SoundCloud と DB に反映する
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
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "recommendationId": 4324,
  "trackId": 789(内部のtrackId)
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
        "isLiked": false, // DBのいいね状態のみを信頼
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
          "isLiked": true, // DBのいいね状態のみを信頼
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
          "isLiked": true, // DBのいいね状態のみを信頼
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
