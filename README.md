# DigBeats-v3

## 概要

### どんなアプリ？

DigBeats-v3 は SoundCloud API を用いて、 フォロー中のアーティスト が「like」した楽曲から、新たな音楽に出会える 楽曲レコメンド Web アプリです。

このレコメンド方法は、音楽好きがよく行う「お気に入りのユーザー(アーティスト)が実際に聞いている曲を聴いてみる」という方法を参考にしたものです。この手法を効率的に、簡単に再現することを目指しています。

### SoundCloud とは？

「SoundCloud」は、誰でも自作の楽曲を公開できる音楽共有プラットフォームです。日本では知名度が高くないものの、海外では多くの著名アーティスト（例：Billie Eilish、Post Malone、Lil Tecca など）を輩出しています。

### 技術的な開発動機

以前は Spotify API を用いて v1 を開発していましたが、API ポリシーの変更によりレコメンド機能が利用できなくなりました。そこで代替案として、新たなレコメンド方式を考案し、今回の実装に採用しました。

また SoundCloud API の導入にあたっては、OAuth2.1（PKCE）によるユーザー認証が必要だったため、Redis と Cookie を用いたセッション管理に挑戦しました。
過去にコードが煩雑化し、機能追加が困難になった経験をふまえ、今回は設計ドキュメントを作成し、レイヤードアーキテクチャをベースに責務分離を徹底した、スケーラブルなアプリケーション設計を心がけました。

<br>

---

## 技術スタック

SoundCloud は、アーティストが「Like」した楽曲が公開されており、ユーザー数・楽曲数も豊富なため、本アプリの中核技術として採用しました。
また、TypeScript によって型の安全性を担保し、開発段階からバグの混入を防止しています。さらに、Redis を用いた高速なセッション管理を導入し、パフォーマンスとセキュリティの両立を図っています。

| 分類           | 技術構成                                    |
| -------------- | ------------------------------------------- |
| フロントエンド | React(Vite + TypeScript)                    |
| バックエンド   | Express(Node + TypeScript) + SoundCloud API |
| データベース   | MySQL                                       |
| セッション管理 | Redis + Cookie                              |

<br>

---

## 実装ログ(進捗) (2025/05/19 時点)

### ☑️ SoundCloud API 動作確認用デモの実装（✅ 実装済み）

API ポリシー変更による Spotify API の一部エンドポイントが利用できなかった経験から、まずは API 検証用の最小構成を実装しました。

[`操作確認用デモのコード`](backend/src/demo.ts)

- SoundCloud OAuth2.1 (PKCE) による認証
- Redis + Cookie によるセッション管理
- トークンを用いて、SoundCloud API エンドポイントから「フォロー中アーティスト取得」
- SoundCloud API エンドポイントから「フォロー中アーティストの like 曲を取得」

<br>

---

### ☑️ 設計ドキュメントの作成 と Docker 開発環境構築（🔄 更新中 2025/05/19 時点）

ユースケース図・概念図・ER 図を作成し、アプリケーションの設計を行いました。
実装で[`アプリ全体の流れ`](docs/overall-flow.md) 、 [`認証の流れ`](docs/auth-flow.md) 、 [`レコメンドアルゴリズム`](docs/recommendations-flow.md) で詳細設計を行いながら実装を進めています。

**全て完成後、各ドキュメントのスクリーンショットを貼る予定**

Docker を用いて MySQL / Redis の開発環境を構築しました。ER 図をもとに開発用の DDL も整備しました。

<br>

---

### ☑️ バックエンド：　レイヤードアーキテクチャをベースにしたアプリ本体の実装　（✅ 実装済み）

#### 🔘 認証フロー(SoundCloud OAuth2.1 (PKCE))の実装（✅ 実装済み）

[`認証フロー`](docs/auth-flow.md) で設計した認証フローに従って、SoundCloud OAuth2.1 (PKCE) を実装しました。

- PKCE に基づきフロントエンドで `codeVerifier`, `codeChallenge`, そして `state` を生成し、`sessionStorage` に一時保存
- 認可成功時に、コールバックで取得した `code` と `codeVerifier` をバックエンドに送信

< 実装した主なコード >

- [`ログイン画面`](frontend/src/login.tsx)
- [`認可 URL を生成するロジック`](frontend/src/generateAuthorizationUrl.tsx)
- [`PKCE を生成するロジック`](frontend/src/generatePkce.ts)
- [`認可後のコールバック処理`](frontend/src/callback.tsx)

< 工夫した点 >

- `code` と `codeVerifier` は漏洩リスクを最小限にするため、フロントエンドが短時間だけ保持する設計にした。

<br>

#### 🔘 認証フロー(トークン取得 と セッション生成)の実装（✅ 実装済み）

[`認証フロー`](docs/auth-flow.md) で設計した認証フローに従って、トークン取得 と セッション生成ロジックを実装しました。

- バックエンドで `code` と `codeVerifier` を用いてトークン (`accessToken`, `expiresIn`, `refreshToken`) を取得
- トークンを使って SoundCloud の /me エンドポイントでユーザー情報(soundcloudUserId)取得
- DB にユーザーが既に登録されているか確認
  - 存在しなければ新規登録
- `sessionId` を発行
- セッション期限付きで トークン と `soundcloudUserId` を Redis に保存
- Cookie をセットし、`sessionId` をフロントエンドに返却

< 実装した主なコード >

- [`認証ユースケース`](backend/src/application/usecase/authorizeUserUseCase.ts)
- [`トークンを取得`](backend/src/infrastructure/api/tokenSoundCloudRepository.ts)
- [`外部ユーザー情報を取得`](backend/src/infrastructure/api/userSoundCloudRepository.ts)
- [`DB ユーザー情報を取得`](backend/src/infrastructure/db/userMysqlRepository.ts)
- [`セッションを保存`](backend/src/infrastructure/redis/sessionRedisRepository.ts)

< 工夫した点 >

- トークンはフロントに渡さず、セッションを使って全てバックエンドで管理する設計にした。
- アプリケーション層が インフラストラクチャ層 に依存しないように、ドメイン層に**インターフェース** ([`userApiRepository`](backend/src/domain/interfaces/userApiRepository.ts), [`userDbRepository`](backend/src/domain/interfaces/userDbRepository.ts))を導入した。
- 取得したデータを統一的に扱うために **ValueObject** ([`UserInfo`](backend/src/domain/valueObjects/userInfo.ts), [`Token`](backend/src/domain/valueObjects/token.ts), [`Session`](backend/src/domain/valueObjects/session.ts))を導入した。

<br>

#### 🔘 トークン・セッション管理の実装（✅ 実装済み）

SoundCloud API と通信に必要な、アクセストークンの有効期限チェックと、必要に応じたトークンリフレッシュを [`tokenApplicationService`](backend/src/application/applicationSercices/tokenApplicationService.ts) に切り出して実装しました。

- Cookie から `sessionId` を取得
- Redis から `session` を復元し、`accessToken` を検証
- `accessToken` が期限切れの場合は `refreshToken` で更新
- 有効なトークンを返却(セッションが取得できなければ再ログインを要求)

< 実装した主なコード >

- [`トークン・セッションを管理`](backend/src/application/applicationSercices/tokenApplicationService.ts)

< 工夫した点 >

- トークン・セッション管理ロジックを [`tokenApplicationService`](backend/src/application/applicationSercices/tokenApplicationService.ts) に切り出し、再利用できるようにした。

<br>

#### 🔘 フォロー中のアーティストを取得するエンドポイントの実装（✅ 実装済み）

ホーム画面でフォロー中のアーティストを確認できるように、フォロー中のアーティストを取得するエンドポイントを実装しました。

- セッション ID からユーザーを特定し、SoundCloud API でフォロー中のアーティストを取得

< 実装した主なコード >

- [`ユースケース`](backend/src/application/usecase/fetchMyFollowingsUseCase.ts)
- [`フォロー中のアーティスト情報を取得`](backend/src/infrastructure/api/userSoundCloudRepository.ts)

< 工夫した点 >

- 取得したデータを統一的に扱うために **ValueObject** ([`ArtistInfo`](backend/src/domain/valueObjects/artistInfo.ts))を導入した。

<br>

#### 🔘 アーティストを検索するエンドポイントの実装（✅ 実装済み）

ホーム画面でアーティストを検索し、フォローできるように、アーティストを検索するエンドポイントを実装しました。

- クエリ文字列からアーティスト名を受け取り、SoundCloud API 通じてアーティストを検索
- 検索結果アーティストを最大 5 件まで取得し、`ArtistInfo` VO を返却

< 実装した主なコード >

- [`ユースケース`](backend/src/application/usecase/searchArtistsUseCase.ts)
- [`アーティストを検索`](backend/src/infrastructure/api/artistSoundCloudRepository.ts)

< 工夫した点 >

- クエリ文字列のバリデーションを [`artistController`](backend/src/presentation/controller/artistController.ts) で実装しました。

<br>

#### 🔘 アーティストをフォローするエンドポイントの実装（✅ 実装済み）

ホーム画面でアーティストを検索して、フォローできるように、アーティストをフォローするエンドポイントを実装しました。

- パラメータから `soundcloudArtistId` を受け取り、SoundCloud API でアーティストをフォロー

< 実装した主なコード >

- [`ユースケース`](backend/src/application/usecase/followArtistUseCase.ts)
- [`アーティストをフォロー`](backend/src/infrastructure/api/userSoundCloudRepository.ts)

< 工夫した点 >

- `soundcloudArtistId` のバリデーション と Number 型への変換を [`userController`](backend/src/presentation/controller/userController.ts) で実装しました。

<br>

#### 🔘 レコメンド機能のコアロジックの実装（✅ 実装済み）

フォロー中の SoundCloud アーティスト が「Like した楽曲」をもとに、楽曲レコメンドを生成するというこのアプリケーションのコアとなるロジックを実装しました。

[`レコメンドアルゴリズム`](docs/recommendations-flow.md) で設計したレコメンドロジックに沿って実装を行いました。(詳しくはこちらをご覧ください)

- フォロー中のアーティストからレコメンドのソースとなるアーティストを選ぶ
- 選ばれたアーティストから いいね楽曲 をランダムに 10 曲選び、データを取得
- 取得したいいね楽曲からレコメンドを作成

< 実装した主なコード >

- [`レコメンド取得ユースケース`](backend/src/application/usecase/getRecommendationUseCase.ts)
- [`フォロー中のアーティストを取得`](backend/src/infrastructure/api/userSoundCloudRepository.ts)
- [`ソースとなるアーティストをランダムに選ぶアルゴリズム`](backend/src/domain/domainServices/recommendationDomainService.ts)
- [`仮想アーティストを生成するロジック`](backend/src/domain/factories/virtualArtistFactory.ts)
- [`いいね楽曲をランダムに選んで取得するアルゴリズム`](backend/src/application/applicationSercices/recommendationApplicationService.ts)

< 工夫した点 >

- 取得したデータを統一的に扱うために **ValueObject** ([`Followings`](backend/src/domain/valueObjects/followings.ts), [`RegularArtist`](backend/src/domain/valueObjects/regularArtist.ts), [`VirtualArtist`](backend/src/domain/valueObjects/virtualArtist.ts)) を導入した。
- レコメンドのソースとなるアーティストは、通常アーティスト と 仮想アーティスト(いいね楽曲数が少ない複数のアーティストを束ねた) があり、それぞれ処理が異なるため、**モデル** ([`SourceArtist`](backend/src/domain/models/sourceArtist.ts)) を定義し、アプリケーション層での処理を共通化できるようにした。
- ValueObject にメソッドを持たせたり、複雑なロジックはサービスに切り出すなどして、可読性を高め、継続的な開発ができるようにした。
- ランダム性・処理速度・音楽ディグ体験のバランスを取るために、フェッチ対象のアーティスト数と取得楽曲数の設計を慎重に調整した。

<br>

#### 🔘 レコメンド結果の DB 保存処理の実装（✅ 実装済み）

レコメンド結果とそれに関連するデータを **トランザクション** を活用して DB に保存する処理を実装しました。

- レコメンドエンティティを生成
- レコメンド結果と関連データをトランザクションを活用して保存（内部 ID を発行）
- レコメンドエンティティに ID を付与

< 実装した主なコード >

- [`レコメンド取得ユースケース`](backend/src/application/usecase/getRecommendationUseCase.ts)
- [`レコメンド結果を保存(トランザクション)`](backend/src/infrastructure/db/recommendationMySQLRepository.ts)
- [`関連するアーティストを保存`](backend/src/infrastructure/db/artistMysqlRepository.ts)
- [`関連する楽曲を保存`](backend/src/infrastructure/db/tracksMysqlRepository.ts)

< 工夫した点 >

- レコメンドを意味のあるまとまりとして扱うために **Entity** ([`Recomendation`](backend/src/domain/entities/recommendation.ts)) を導入した。
- [`Recomendation`](backend/src/domain/entities/recommendation.ts) エンティティは ID を持たない状態で生成し、保存後に ID を付与（後から一意性を確定）
- 保存対象が多テーブルにまたがるため、トランザクションで一括処理を行った。
- 重複登録を防ぎつつ、整合性を保ったデータ保存ができるように注意した。
- レコメンド結果と楽曲は多対多の関係なので、中間テーブルを用いて関係を適切に表現した。

<br>

#### 🔘 レコメンド履歴を取得するエンドポイントの実装（✅ 実装済み）

レコメンド履歴を表示するためのエンドポイントを実装しました。

- `recommendations` テーブルに `recommendations_tracks` (中間テーブル) と `tracks` テーブルを結合し、過去のレコメンド情報と各楽曲の表示に必要な情報を一括で取得
- `recommendationId` ごとにレコメンド履歴を構造化し、フロントエンドに返却

< 実装した主なコード >

- [`履歴取得ユースケース`](backend/src/application/usecase/getHistorysUseCase.ts)
- [`レコメンド履歴を取得`](backend/src/infrastructure/db/historyMysqlRepository.ts)

< 工夫した点 >

- 複数テーブルを結合することで、必要な情報を一度に取得し、DB へのアクセス回数を最小限に抑えてパフォーマンスを向上させた。
- 「過去のレコメンド」と「それに紐づく楽曲群」を意味のあるまとまりとして扱うために、 **Entity** ([`recommendationRecord`](backend/src/domain/entities/recommendationRecord.ts), [`recordedTrack`](backend/src/domain/entities/recordedTrack.ts)) を導入した。
- 楽曲単位の「いいね状態（wasLiked）」を中間テーブルで管理し、履歴表示時にその情報を使用する設計とした。
- SoundCloud 上の現在の「いいね状態」は確認せず、「レコメンド生成時にユーザーがいいねしたかどうか」のログを記録する設計とすることで、SoundCloud と DB の整合性を気にしないシンプルな構成にした。

<br>

#### 🔘 レコメンド楽曲にいいねをする処理の実装（✅ 実装済み）

レコメンド生成画面で、ユーザーが「いいね」操作を行えるように、レコメンド楽曲の外部状態（SoundCloud）とアプリ内 DB を更新するエンドポイントを実装しました。

- SoundCloud API に対して「いいね」を即時反映
- 同時に、`recommendations_tracks` テーブルの `was_liked` を `true` に更新し、「当時のユーザー反応ログ」として保存

< 実装した主なコード >

- [`いいねするユースケース`](backend/src/application/usecase/likeTracksUseCase.ts)
- [`SoundCloudトラックIDを取得`](backend/src/infrastructure/db/tracksMysqlRepository.ts)
- [`SoundCloudにいいねを反映`](backend/src/infrastructure/api/likeSoundCloudRepository.ts)
- [`いいねログをDBに記録`](backend/src/infrastructure/db/likeMysqlRepository.ts)

< 工夫した点 >

- SoundCloud 上の状態とアプリ内 DB の状態は同期しない設計とし、履歴画面では「表示のみ」を許可する構成にした

<br>

---

### ☑️ フロントエンド：　アプリ本体の実装（🔄 実装中）

#### 🔘 ログイン画面・コールバック画面の UI 実装（✅ 実装済み）

Tailwind CSS を導入し、ログイン画面およびコールバック画面をモバイル・PC 両対応のレスポンシブ UI で実装しました。  
OAuth 認証フローでは、デモ実装で作成済みの [`generateAuthorizationUrl`](frontend/src/auth/generateAuthorizationUrl.ts), [`generatePkce`](frontend/src/auth/generatePkce.ts), [`Callback`](frontend/src/pages/callback.tsx) を再利用しています。

- ログイン画面では [`generateAuthorizationUrl`](frontend/src/auth/generateAuthorizationUrl.ts) によって認可 URL を生成し、SoundCloud OAuth 認証画面へリダイレクト
- コールバック画面では [`callback.tsx`](frontend/src/pages/callback.tsx) にて `state` を検証し、正当なリクエストであることを確認後、バックエンドへ `code` + `codeVerifier` を送信しセッションを取得
- ログイン中の状態を示すローディングスピナー UI を Tailwind CSS で実装
- 認証完了後、トップページ（`/`）へ自動遷移

< 実装した主なコード >

- [`ログイン画面`](frontend/src/pages/login.tsx)
- [`OAuth 認可 URL を生成`](frontend/src/auth/generateAuthorizationUrl.ts)
- [`PKCE を生成`](frontend/src/auth/generatePkce.ts)
- [`コールバック処理(画面)`](frontend/src/pages/callback.tsx)

< 工夫した点 >

- ログイン画面マウント時に、前回の残留 `state` や `codeVerifier` を削除することで、認可処理の整合性を保つ設計にした。
- 「アカウント作成」「ログイン」ボタンを UI 上で分け、動作は同じでも UX を向上させた。
- コールバック後に認証情報をバックエンドに送信した後、`sessionStorage` を削除することでセキュリティ向上させた。
- ログイン処理中に操作されないよう、コールバック画面にローディング UI を表示した。

<br>

#### 🔘 ホーム画面（レコメンド画面）の実装（✅ 実装済み）

ホーム画面では、ユーザーが最大 3 回までレコメンドを生成し、その中から 1 件を「今日のレコメンド」として保存できます。保存済みの状態では、翌日まで同じレコメンドが表示され、再生成はできません。画面上では楽曲の再生、いいね（保存前のみ）が可能です。

- 「今日のレコメンド」を[`useRecommendation`](frontend/src/hooks/useRecommendation.ts)の`fetchTodayRecommendation`で取得
  - 今日のレコメンドが既に DB に保存されている場合　`isSaved` を `true` とし、フェッチした「今日のレコメンド」を表示する
  - 今日のレコメンドがまだ DB に保存されていない場合 `isSaved` を `false` とする
- `isSaved = false` の場合はレコメンドを生成可能
  - レコメンドボタンが押されると、[`useRecommendation`](frontend/src/hooks/useRecommendation.ts)の`handleGenerate`でレコメンドが生成される
  - ２回までリフレッシュ可能(計３回生成可能)で、[`useRecommendation`](frontend/src/hooks/useRecommendation.ts)の`todaysGenerateCount`で生成回数を管理する
  - 生成回数に応じて、「Genarate Recommendation」ボタンが「Refresh」ボタンやメッセージに切り替わる
  - 生成された直後のレコメンド画面では、[`useRecommendation`](frontend/src/hooks/useRecommendation.ts)の`toggleLike`で楽曲のいいねが可能
- 生成されたレコメンドで気に入るものがあれば「Save」ボタンで「今日のレコメンド」として DB に保存可能
  - 「Save」ボタンが押されると、[`useRecommendation`](frontend/src/hooks/useRecommendation.ts)の`handleSave`で DB にレコメンドが保存される
  - レコメンドが保存されるとき、同時に「いいね」を保存する（`wasLiked`ログとして DB に保存し、書き換えることはできない）
  - `isSaved` を `true` とし、生成した「今日のレコメンド」を表示する
- 「今日のレコメンド」画面では、楽曲の再生と「いいねログ」の確認が可能

< 実装した主なコード >

- [`ホーム画面（レコメンド画面）`](frontend/src/pages/Home.tsx)
- [`レコメンドに関するHooks(useRecommendation)`](frontend/src/hooks/useRecommendation.ts)
- [`レコメンドボタンのコンポーネント`](frontend/src/components/RecommendationButtons.tsx)
- [`レコメンドされたトラックの一覧表示のコンポーネント`](frontend/src/components/RecommendedTrackList.tsx)
- [`レコメンドされたトラック表示のコンポーネント`](frontend/src/components/RecommendedTrackItem.tsx)

< 工夫した点 >

- 外部の SoundCloud API との通信量を最小限に抑えるため、「いいね」状態は SoundCloud 側と同期せず、アプリ内の DB にのみ保存
- いいねを保存するタイミングは、「今日のレコメンド」としてレコメンドを保存するタイミングと統一した
- リフレッシュ機能で質の高いレコメンドが生成される確率を高めた

<br>

#### 🔘 問題点を解決するためホーム画面（レコメンド画面）の設計を大幅に変更（✅ 実装済み）

< 問題点 >

- レコメンド生成時に DB に保存する設計であり、保存する時にレコメンドに対して ID が付与されるため、ユーザーの操作によってレコメンドを保存する設計にしてしまうと、リスト表示のための`key`が存在しないケースが発生する。
- また、全てのレコメンドが DB に保存されるため、「今日のレコメンド」として表示したいものだけを抽出するのが困難になる。

< 変更点 >

- リフレッシュ機能は廃止し、「1 日最大 3 回までレコメンドを生成可能」とし、それら全てを「今日のレコメンド」として表示する設計に変更した。
- `isSaved` と `recommendation` で状態管理していた設計を廃止し、`recommendations` 配列に最大 3 件まで保存する形に変更した。
- 「いいね状態」「トラックの展開状態」「今日のレコメンド状態」がすべて[`useRecommendation`](frontend/src/hooks/useRecommendation.ts)に集中していたため、それぞれの責務に応じて以下のフックに分離：
  - [`useLike`](frontend/src/hooks/useLike.ts)
  - [`useTrack`](frontend/src/hooks/useTrack.ts)
  - [`useRecommendation`](frontend/src/hooks/useRecommendation.ts)
- 「今日のレコメンド」が最大 3 件表示されるようになったため、一覧表示用に[`RecommendationList`](frontend/src/components/RecommendationList.tsx)コンポーネントを新規作成し、再利用可能にした。
- 直近で追加されたレコメンドをユーザーに視覚的に伝えるため、[`useRecommendation`](frontend/src/hooks/useRecommendation.ts)の`animatedId`と`setAnimatedId`でアニメーションを追加した。
- いいね状態の管理方法を変更：
  - レコメンド取得時のレスポンス `wasLiked` を用いた管理を廃止した。
  - フロントエンドでのいいね状態は、常に SoundCloud 上の情報を参照する。
  - ただし、ユーザーがアプリ上で行った「いいね／いいね解除」の操作は、 SoundCloud API に即時反映し、加えて、アプリ内ログとして `isLikedInApp` に記録する。
    ※ただし、このログは SoundCloud 本体で行われた状態変更とは同期させず、ユーザーがアプリ上で行った操作のみを反映させる

<br>

#### 🔘 ホーム画面（アーティスト検索画面）の実装（✅ 実装済み）

ホーム画面の検索バーから遷移できる検索画面では、SoundCloud アーティスト名で検索し、該当するアーティストをフォロー・解除することできます。フォロー状態は 外部の SoundCloud に即時に反映されます。

- ホーム画面の検索バーをクリックすると、[`Home`](frontend/src/pages/Home.tsx)の画面切り替え用の Hooks である`isSearching = true`になり、ホーム画面が検索モードに変化する
- [`HeaderBar`](frontend/src/components/HeaderBar.tsx)の`onSearchQueryChange`や`onSearchSubmit`によって、検索バーの`value`が変わったこと、登録されたことが通知される
- アクション通知を受け取ると、その通知の種類に応じて[`useSearch`](frontend/src/hooks/useSearch.ts)の`setSearchQuery`や`handleSearch`によって処理が行われ、検索結果が`artists`に格納される
- 検索結果は[`ArtistList`](frontend/src/components/artistList.tsx)によって一覧表示される
- 検索結果に表示されたアーティストに対し、「フォロー」ボタンでフォロー・解除ができる
  - [`Home`](frontend/src/pages/Home.tsx)画面マウント時に`useEffect`によって[`useFollow`](frontend/src/hooks/useFollow.ts)の`fetchFollowedIds`が発火し、SoundCloud でのフォロー状態をフロントエンドに取得する
  - 「フォロー」ボタンが押されると、[`useFollow`](frontend/src/hooks/useFollow.ts)の`toggleFollow`でバックエンドを通して SoundCloud にフォロー状態が保存され、フロントエンドの`followedSoundCloudArtistIds`も書き換えられる

< 実装した主なコード >

- [`ホーム画面（アーティスト検索画面）`](frontend/src/pages/Home.tsx)
- [`検索に関するHooks(useSearch)`](frontend/src/hooks/useSearch.ts)
- [`ヘッダー（検索バー）`](frontend/src/components/HeaderBar.tsx)
- [`アーティストフォローに関するHooks(useFollow)`](frontend/src/hooks/useFollow.ts)
- [`アーティスト一覧表示のコンポーネント`](frontend/src/components/artistList.tsx)

< 工夫した点 >

- アーティストの検索結果を表示するコンポーネントを[`ArtistList`](frontend/src/components/artistList.tsx)として分離して再利用可能にした
- フォロー状態もいいね状態と同様に[`useFollow`](frontend/src/hooks/useFollow.ts)の`toggleFollow`でトグル形式で管理し、状態管理が容易な設計にした
- [`useFollow`](frontend/src/hooks/useFollow.ts)の`useEffect`でホーム画面マウント時に SoundCloud のフォロー状態をフェッチすることで、データの整合性が崩れないようにした

<br>

#### 🔘 プロフィール画面の実装（✅ 実装済み）

プロフィールページを追加し、ユーザー情報、フォロー中アーティスト、およびレコメンド履歴をシングルページで表示・操作できるようにしました。

- [`ホーム画面`](frontend/src/pages/Home.tsx)の[`HeaderBar`](frontend/src/components/HeaderBar.tsx)にあるプロフィールアイコンをクリックすると、[`プロフィールページ`](frontend/src/pages/Profile.tsx)に遷移する
- [`プロフィール画面`](frontend/src/pages/Profile.tsx)ではユーザー情報(基本情報、レコメンド数、フォロー数)・[`フォロー中のアーティスト一覧`](frontend/src/components/artistList.tsx)・[`レコメンド履歴`](frontend/src/components/HistoryList.tsx)を見ることができる
  - フォロー数をクリックすると、[`フォロー中のアーティスト一覧画面`](frontend/src/components/artistList.tsx)に遷移し、アーティストの確認とフォロー操作ができる
  - [`レコメンド履歴`](frontend/src/components/HistoryList.tsx)はレコメンド生成日時によって表示されており、レコメンドをクリックすると、展開して[`レコメンド楽曲の一覧`](frontend/src/components/RecommendedTrackList.tsx)を見ることができる
    - [`レコメンド楽曲の一覧`](frontend/src/components/RecommendedTrackList.tsx)では、「今日のレコメンド」と同様にいいね操作ができる

< 実装した主なコード >

- [`ホーム画面`](frontend/src/pages/Home.tsx)
- [`プロフィールアイコン`](frontend/src/components/HeaderBar.tsx)
- [`プロフィール画面`](frontend/src/pages/Profile.tsx)
- [`フォロー中のアーティスト一覧`](frontend/src/components/artistList.tsx)
- [`レコメンド履歴`](frontend/src/components/HistoryList.tsx)
- [`アーティストフォローに関するHooks(useFollow)`](frontend/src/hooks/useFollow.ts)
- [`レコメンド履歴に関するHooks(useHistory)`](frontend/src/hooks/useHistory.ts)
- [`ユーザー基本情報に関するHooks(useUser)`](frontend/src/hooks/useUser.ts)

< 工夫した点 >

- 共通コンポーネント（[`ArtistList`](frontend/src/components/artistList.tsx), [`RecommendedTrackList`](frontend/src/components/RecommendedTrackList.tsx)）を再利用した
- [`useFollow`](frontend/src/hooks/useFollow.ts), [`useHistory`](frontend/src/hooks/useHistory.ts), [`useUser`](frontend/src/hooks/useUser.ts)などの既存 Hooks を調整し、活用することで、ロジックの重複を避けつつ状態管理をシンプルに実装した
