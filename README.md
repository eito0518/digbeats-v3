# DigBeats

## 目次

- サービスについて
- 開発の経緯
- 主な機能（使い方）
- 使用技術
- アプリケーション設計
- こだわった実装
- 今後の開発について

<br>

## サービスについて

サービス URL： https://www.digbeats.jp

※ 外部サービス [SoundCloud](https://soundcloud.com) のアカウント登録が必要です

![ランディングページ画像](docs/assets/landing-page.png)

### どんなアプリ？

**DigBeats は、有名アーティストが普段聴いている楽曲をソースとして、ユーザーにおすすめの楽曲を提供する音楽発見 Web アプリケーションです。**

本アプリは音楽共有プラットフォーム「SoundCloud」の補助的なアプリとして位置付けています。SoundCloud API を利用して、アーティストの検索・フォローはもちろん、アーティストが普段聴いていて、お気に入りに登録されている楽曲を取得し、それをソースに『**独自のアルゴリズム**』で、ユーザーに楽曲のレコメンドを行います。**ただ外部の API を使ったアプリケーションではなく**、バックエンド側で外部 API と内部のデータベースをうまく連携させて、実装しています。

<br>

### SoundCloud とは？

「SoundCloud」は、誰でも自作の楽曲を公開できる音楽共有プラットフォームです。日本では知名度が高くないものの、海外では多くの著名アーティスト（例：Billie Eilish、Post Malone、Lil Tecca など）を輩出しています。

URL：https://soundcloud.com

<br>

---

## 開発の経緯

私は大学１年の冬からサークルでダンスをやっています。ダンスサークルでは自分たちでいけてる音楽を探して、それに合わせて振り付けを作り、ダンスを踊ります。これは私の感覚ですが、ダンスの曲を選ぶ際、有名でなくニッチでかっこいい曲がダンス曲としては好まれる傾向があります。SoundCloud はそんなニッチでかっこいい曲を探すのにもってこいのサイトです。しかし、楽曲数も多く見つけるのがすごく大変で時間がかかる作業です。そこで気軽に自分の好みの曲を探せたら便利だということでこのアプリケーションを思いつきました。音楽好きがよく行う「お気に入りのユーザー(アーティスト)が実際に聞いている曲を聴いてみる」という方法を参考に今回のレコメンドのアルゴリズムを考えました。

<br>

### 過去の開発における課題 と 今回の開発の関係性

以前は Spotify API を用いて 同様の楽曲レコメンドアプリを開発していましたが、API ポリシーの変更によりレコメンド API が利用できなくなりました。そこで代替案として、SoundCloud API で取得したデータを用いた、独自のレコメンド方式を考案し、今回の実装に採用しました。

また SoundCloud API の導入にあたっては、OAuth2.1（PKCE）によるユーザー認証が必要だったため、Redis と Cookie を用いたセッション管理に挑戦しました。
過去にコードが煩雑化し、機能追加が困難になった経験をふまえ、今回は設計ドキュメントを作成し、クリーンアーキテクチャをベースに責務の分離を意識したアプリケーション設計を行いました。

<br>

---

## 主な機能（使い方）

DigBeats は SoundCloud アカウントがあればすぐに始められます。

### Step 1: アカウント登録 / ログイン

<img src="docs/assets/login.png" width="600">
<p>お使いのSoundCloudアカウントでログインするだけで、SoundCloud「アーティストの検索」「アーティストのフォロー」「楽曲のいいね」機能が利用可能になります。</p>

> 主な関連コード

※ これらのファイルから処理の流れを追えます

- Backend
  - [authorizeUserUseCase.ts](backend/src/application/usecase/authorizeUserUseCase.ts)
- Frontend
  - [Login.tsx](frontend/src/pages/Login.tsx)
  - [Callback.tsx](frontend/src/pages/Callback.tsx)

<br>

### Step 2: アーティストを「検索」して「フォロー」

<img src="docs/assets/search-follow.png" width="600">
<p>お気に入りのアーティストを検索・フォローして、あなたの音楽の好みを登録します。フォローしたアーティストの「いいね」している楽曲がレコメンドのソースとなります。</p>

> 主な関連コード

※ これらのファイルから処理の流れを追えます

- [searchArtistsUseCase.ts](backend/src/application/usecase/searchArtistsUseCase.ts)
- [followArtistUseCase.ts](backend/src/application/usecase/followArtistUseCase.ts)

<br>

### Step 3: 「レコメンド生成ボタン」をクリック

<img src="docs/assets/home.png" width="600">
<p>フォローしたアーティストの「いいね」している楽曲をもとに、独自のレコメンドアルゴリズムでユーザーにおすすめの楽曲を提供します。</p>

> 主な関連コード

※ このファイルから処理の流れを追えます

- [getRecommendationUseCase.ts](backend/src/application/usecase/getRecommendationUseCase.ts)

<br>

### Step 4: 気になる楽曲を聴いてみる

<img src="docs/assets/listen.png" width="600">
<p>レコメンドされた楽曲の中から気になるものを聞いてみましょう。お気に入りの楽曲がきっと見つかります。</p>

<br>

### Step 5: 「ハートボタン」で楽曲をお気に入り登録

<img src="docs/assets/like.png" width="600">
<p>気に入った楽曲を登録します。登録した楽曲はSoundCloudのいいねに即時反映されます。</p>

> 主な関連コード

※ このファイルから処理の流れを追えます

- [likeTrackUseCase.ts](backend/src/application/usecase/likeTrackUseCase.ts)

<br>

---

## その他の機能

### History: 今までの「レコメンド履歴」を確認

<img src="docs/assets/history.png" width="600">
<p>ホーム画面 右上の「プロフィールアイコン」をクリックすると、プロフィールページに移動します。 ここでは「過去のレコメンドの履歴」を確認でき、気に入った楽曲を改めて登録することもできます。</p>

> 主な関連コード

※ このファイルから処理の流れを追えます

- [getTodayRecommendationsUseCase.ts](backend/src/application/usecase/getTodayRecommendationsUseCase.ts)

<br>

### Followings: 「フォロー中のアーティスト」を確認

<img src="docs/assets/followings.png" width="600">
<p>プロフィールページの「Followings」をクリックすると、フォロー中のアーティストを確認できます。</p>

> 主な関連コード

※ このファイルから処理の流れを追えます

- [fetchMyFollowingsUseCase.ts](backend/src/application/usecase/fetchMyFollowingsUseCase.ts)

---

<br>

## 使用技術

| 分類           | 技術                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------- |
| フロントエンド | React / Vite / TypeScript / TailwindCSS                                                      |
| バックエンド   | Express / Node / TypeScript / SoundCloud API                                                 |
| データベース   | MySQL                                                                                        |
| セッション管理 | Redis / Cookie                                                                               |
| 認証           | SoundCloud OAuth 2.1                                                                         |
| 環境構築       | Docker / Docker hub                                                                          |
| バージョン管理 | Git / Git hub                                                                                |
| CI/CD          | Github Actions                                                                               |
| インフラ       | Azure Static Web Apps / Azure App Service / Azure DataBase for MySQL / Azure Cache for Redis |

<br>

インフラ構成図

---

<br>

## アプリケーション設計

### アプリケーションアーキテクチャ

本アプリのバックエンドは、クリーンアーキテクチャをベースに責務の分離を意識して設計しました。以下の図のように、依存関係が常に中心（Domain）に向かうように、インターフェイスを導入しました。

![アーキテクチャ階層図](docs/assets/architecture-diagram.png)

| レイヤー       | ディレクトリ    | 主な役割                                                                                                 |
| :------------- | :-------------- | :------------------------------------------------------------------------------------------------------- |
| Presentation   | presentation/   | リクエストの受付、レスポンスの返却、ルーティングを行います。                                             |
| Application    | application/    | ユースケース（ユーザーの操作）を実現する具体的な処理フローを実装します。                                 |
| Domain         | domain/         | アプリケーションの最も核となるビジネスルールやデータ構造（値オブジェクト、エンティティ等）を定義します。 |
| Infrastructure | infrastructure/ | データベース、外部 API、Redis など、外部システムと通信を行います。                                       |

具体例

<br>

### ER 図

SoundCloud から API を通じて毎回最新のものを取得するものと、本アプリケーションの DB 内で保存数ものを吟味して、SoundCloud 側と同期を行わなくても十分なユーザー体験が可能な形に DB に保存する情報を検討して設計を行いました。

![ER図](docs/assets/er-diagram.png)

<br>

---

## こだわった実装

テキスト

<br>

### ログイン機能

テキスト

> より詳しくみたい場合は以下をご覧ください

[auth-flow.md](docs/specifications/auth-flow.md)

<br>

### レコメンドアルゴリズム

テキスト

> より詳しくみたい場合は以下をご覧ください

[recommendations-flow.md](docs/specifications/recommendations-flow.md)

<br>

## 今後の開発について

テキスト

<br>

---
