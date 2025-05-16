## 全体の流れ

### ログイン画面

- フロントで codeVerifier + codeChallemge, state 生成
- codeChallemge, state を含めた認可 URL を生成し、SoundCloud ログイン画面にリダイレクト
- コールバックで code, state を受け取り、state を検証
- 検証 OK であれば、バックエンドに codeVerifier, state を送信し、sessionId を受け取る。(ローカルの code, codeVerifier, state を削除)

### ホーム画面

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
    likedTracksCount: 123,
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
    likedTracksCount: 123,
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
- 注意：ユーザー情報の再配信は API ポリシー違反のため、レコメンドされた Track の出典がわからないようにする（最低５人以上はフォローさせる）
- 認証：Cookie(sessionId)
- レスポンス：

```json
{
  recomendationId: 12345(内部のID),
  tracks: [
    {
      id: 12345(内部のID),
      title: FE!N,
      artworkUrl: https:~,
      permalinkUrl: https:~,
      artist: {
        name: Travis Sccott,
        avatarUrl: https:~,
        permalinkUrl: https:~,
      },
      // SoundCloud APIで曲を再生する場合 (再生APIのURLを保存することはAPIポリシー違反のため、レコメンド直後の表示のみに使用)
      streamUrl: https:~,
      // ウィジェットで曲を再生する場合　（APIポリシーに注意して、trackIdと再生ウィジェットのみDB保存、レコメンド履歴はこちらを使用）
      widgetUrl: https:~,
    },
    ...
  ]
}
```

### GET /api/recommendations/historys

- 説明：楽曲レコメンド履歴を取得する
- 認証：Cookie(sessionId)
- レスポンス：

```json
[
  {
    recommendationId: 12345(内部のID),
    recommended_at: "2025-04-18T10:00:00Z",
    tracks: [
      {
        // Track情報をそれぞれフェッチするのは、通信回数が多いため、情報表示・再生共にウィジェットを利用する
        trackId: 12345 (内部のID)
        widgetUrl: https:~,
      },
      ...
    ]
  },
  ...
]
```

### POST /api/recommendations/:recommendationId/likes

- 説明：楽曲レコメンド画面 or 履歴画面 での いいね（内部＆外部）を更新する
- 認証：Cookie(sessionId)
- リクエスト：

```json
{
  "likes": {
    // 結果的に変更があったものだけを送る
    "789(内部のtrackId)": true,
    "790(内部のtrackId)": false,
    ...
  }
}
```
