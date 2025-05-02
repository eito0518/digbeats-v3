# DigBeats-v3

## 概要

### どんなアプリ？

**DigBeats-v3** は SoundCloud API を用いて、 フォロー中のアーティスト が「like」した楽曲から、新たな音楽に出会える 楽曲レコメンド Web アプリです。

このレコメンド方法は、音楽好きがよく行う「お気に入りのユーザー(アーティスト)が実際に聞いている曲を聴いてみる」という方法を参考にしたものです。この手法を効率的に、簡単に再現することを目指しています。

### SoundCloud とは？

「SoundCloud」は、誰でも自作の楽曲を公開できる音楽共有プラットフォームです。日本では知名度が高くないものの、海外では多くの著名アーティスト（例：Billie Eilish、Post Malone、Lil Tecca など）を輩出しています。

### 技術的な開発動機

以前は Spotify API を用いて v1 を開発していましたが、API ポリシーの変更によりレコメンド機能が利用できなくなりました。そこで代替案として、新たなレコメンド方式を考案し、今回の実装に採用しました。

また SoundCloud API の導入にあたっては、OAuth2.1（PKCE）によるユーザー認証が必要だったため、Redis と Cookie を用いたセッション管理に挑戦しました。
過去にコードが煩雑化し、機能追加が困難になった経験をふまえ、今回は設計ドキュメントを作成し、レイヤードアーキテクチャをベースに責務分離を徹底した、スケーラブルなアプリケーション設計を心がけました。

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

---

## 実装計画 と 進捗 (2025/05/02 時点)

### ☑️ SoundCloud API 動作確認用デモの実装（✅ 実装済み）

API ポリシー変更による Spotify API の一部エンドポイントが利用できなかった経験から、まずは API 検証用の最小構成を実装しました。

[`demo.ts`](backend/src/demo.ts)

- 1. SoundCloud OAuth2.1 (PKCE) による認証
- 2. Redis + Cookie によるセッション管理
- 3. トークンを用いて、SoundCloud API エンドポイントから「フォロー中アーティスト取得」
- 4. SoundCloud API エンドポイントから「フォロー中アーティストの like 曲を取得」

---

### ☑️ 設計ドキュメントの作成 と Docker 開発環境構築（✅ 実装済み）

ユースケース図・概念図・ER 図に基づき設計を整理し、`openapi.yaml` や `auth-flow.md` で詳細設計も記述しました。

[`usecase-diagram.drawio`](docs/usecase-diagram.drawio)
[`conceptual-diagram.drawio`](docs/conceptual-diagram.drawio)
[`er-diagram.drawio`](docs/er-diagram.drawio)
[`openapi.yaml`](docs/openapi.yaml)
[`auth-flow.md`](docs/auth-flow.md)

開発環境には Docker を用い、MySQL / Redis を構築。ER 図をもとに開発用の DDL も整備しました。

[`reset.ddl`](db/reset.ddl)

---

### ☑️ レイヤードアーキテクチャをベースにしたアプリ本体の実装

#### 🔘 SoundCloud OAuth2.1 (PKCE) による 認可フロー（✅ 実装済み）

[`login.tsx`](frontend/src/login.tsx)
[`callback.tsx`](frontend/src/callback.tsx)

- フロントエンドで `code_verifier`と`state` を生成し、`sessionStorage` に一時保存
- 認可成功時に、取得した `code` と `code_verifier` をバックエンドに送信

< 工夫した点 >

- `code` と `code_verifier` は漏洩リスクを最小限にするため、フロントエンドが短時間だけ保持

<br>

#### 🔘 トークン取得 と セッション生成（✅ 実装済み）

[`authRouter.ts`](backend/src/presentation/router/authRouter.ts)

- バックエンドで `code` と `code_verifier` を用いてトークン (`access_token`, `expires_in`, `refresh_token` など) を取得
- トークンを使用して SoundCloud 上のユーザー情報を取得
- 新規 or 既存ユーザーを判別し、必要に応じて データベース に登録
- UUID ベースの `sessionId` を発行
- TTL を設定した上で、Redis に `{ access_token, accessTokenExpiresAt, refresh_token }` を保存
- クライアントには Cookie 経由 で `sessionId` を返却

< 工夫した点 >

- セッション ID を除き、トークンは一切フロントに渡さず、全てバックエンドで管理
- Presentation 層が Infrastructure 層 に依存しないよう Interface を導入
- 外部 API 由来と DB 由来の ユーザー情報を区別し、 ユーザー情報用の Interface を２つ用意、それぞれデータを取得した後、使いやすい `User` Entity の形で正規化して保持
- `Session` と `Token` ValueObject を導入して、保存されるデータ型を定義

<br>

#### 🔘 トークン・セッション管理（✅ 実装済み）


SoundCloud API と通信するにあたり、アクセストークンの有効期限チェックと、必要に応じたリフレッシュを ApplicationService に切り出しました。

[`tokenApplicationService.ts`](backend/src/application/applicationService/tokenApplicationService.ts)

- Cookie から `sessionId` を取得
- Redis から `session` を復元し、期限を検証
- `accessToken`　が期限切れの場合は `refreshToken` で更新

  < 工夫した点 >

- トークン管理のロジック ApplicationService に切り出し、再利用できるようにした
- `Token` ValueObject を導入して、返却されるデータ型を定義
