# DigBeats

## 目次

- [サービスについて](#サービスについて)
- [主な機能（使い方）](#主な機能使い方)
- [使用技術](#使用技術)
- [アプリケーション設計](#アプリケーション設計)
- [テスト](#テスト)
- [こだわったところ](#こだわったところ)
- [今後の開発について](#今後の開発について)

<br>

## サービスについて

サービス URL： https://www.digbeats.jp

デモ動画 URL： https://youtu.be/S2ZjkgXOHXM

※ 外部サービス [SoundCloud](https://soundcloud.com) のアカウント登録が必要です

![ランディングページ画像](docs/assets/landing-page.png)

### アプリ開発の「経緯」と「目的」

このアプリは、ダンスサークルで経験した私自身の具体的な課題から生まれました。
ダンスで使う曲を探すとき、「**まだあまり知られていない、ニッチでかっこいい曲**」 を見つけるのが理想です。そんな時 SoundCloud は最適なプラットフォームですが、膨大な楽曲の中から好みの曲を探し出すのは非常に困難です。<br>

そこで私は、一部のコアな音楽ファンが実践している、「**好きなアーティストがいいねした曲を聴いてみる**」というディグの手法を知りました。私自身もこの手法を試してみたところ、**実際に良い曲を見つけることができました**。しかし、中には「いいね」一覧が数百曲にもなるアーティストもおり、その全てを聴いていくのは**多くの手間と時間がかかる**という、課題がありました。<br>

そこで「**有効だが、多くの手間と時間がかかる、このディグ手法をもっと気軽に、効率的にできないか？**」 という、という思いからこのアプリを開発することにしました。

<br>

### どんなアプリ？

DigBeats は、上記の「目的」を達成するため、音楽共有プラットフォーム「SoundCloud」 の補助的なアプリとして機能します。<br>

SoundCloud API を利用し、アーティストの検索・フォロー機能に加え、ユーザーがフォローしたアーティストの「いいね」履歴を取得します。そして、それをソースとして、「独自の選定ロジック」 に基づき、ユーザーに新しい楽曲を提供します。

<br>

### SoundCloud とは？

「SoundCloud」は、誰でも自作の楽曲を公開できる音楽共有プラットフォームです。日本では知名度が高くないものの、海外では多くの著名アーティスト（例：Billie Eilish、Post Malone、Lil Tecca など）を輩出しています。

URL：https://soundcloud.com

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
<p>フォローしたアーティストの「いいね」している楽曲をもとに、独自の選定ロジックでユーザーに楽曲を提供します。</p>

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

- [recommendationMySQLRepository.ts](backend/src/infrastructure/db/recommendationMySQLRepository.ts)<br>　(レコメンド生成時は`isLiked=false`)
- [likeTrackUseCase.ts](backend/src/application/usecase/likeTrackUseCase.ts)

<br>

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

<br>

---

## 使用技術

| 分類           | 技術                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------- |
| フロントエンド | React / Vite / TypeScript / TailwindCSS                                                      |
| バックエンド   | Express / Node / TypeScript / SoundCloud API                                                 |
| データベース   | MySQL                                                                                        |
| セッション管理 | Redis / Cookie                                                                               |
| 認証           | SoundCloud OAuth 2.1                                                                         |
| 環境構築       | Docker / Docker Hub                                                                          |
| バージョン管理 | Git / GitHub                                                                                 |
| CI/CD          | Github Actions                                                                               |
| インフラ       | Azure Static Web Apps / Azure App Service / Azure DataBase for MySQL / Azure Cache for Redis |

<br>

![インフラ構成図](docs/assets/infrastructure-diagram.png)

<br>

---

## アプリケーション設計

過去に**コードの機能追加や修正で苦労した経験**から、今回は開発前にしっかりと設計を行いました。クリーンアーキテクチャの考え方を参考に、責務ごとにファイルを分離し、見通しが良く、機能追加しやすいコードを目指しました。

### アプリケーションアーキテクチャ

本アプリのバックエンドは、クリーンアーキテクチャをベースに責務の分離を意識して設計しました。以下の図のように、依存関係が常に中心（Domain）に向かうように、インターフェイスを導入しました。

![アーキテクチャ階層図](docs/assets/architecture-diagram.png)

| レイヤー       | ディレクトリ    | 主な役割                                                                                                 |
| :------------- | :-------------- | :------------------------------------------------------------------------------------------------------- |
| Presentation   | presentation/   | リクエストの受付、レスポンスの返却、ルーティングを行います。                                             |
| Application    | application/    | ユースケース（ユーザーの操作）を実現する具体的な処理フローを実装します。                                 |
| Domain         | domain/         | アプリケーションの最も核となるビジネスルールやデータ構造（値オブジェクト、エンティティ等）を定義します。 |
| Infrastructure | infrastructure/ | データベース、外部 API、Redis など、外部システムと通信を行います。                                       |

#### 具体的な処理フローの例（レコメンド生成処理の場合）

1. **Presentation 層**の`recommendationRouter`がリクエストを受け取り、`recommendationController.di`によって依存注入された`recommendationController`にリクエストを渡します。

2. `recommendationController` はリクエスト内容を検証し、**Application 層** の `getRecommendationUseCase` を呼び出します。

3. `getRecommendationUseCase`は、**Application 層** の`ApplicationService` や **Domain 層**の`DomainService, Value Object, Entity`などを利用して、ビジネスロジックを実行します。

4. この際、**Infrastructure 層** の `trackApiRepository` や `recommendationDbRepository` を（インターフェース経由で）利用して、外部 API や DB と通信します。

5. 処理結果が **Presentation 層**の`recommendationController` に返され、`recommendationPresenter`によって整形された後、クライアントにレスポンスが送信されます。

<br>

### データベース設計

**どのデータを都度 外部 API から取得し、どのデータを内部 DB で永続化するか**を慎重に検討して設計しました。API 呼び出しを最小限に抑え、安定したレスポンスを返すことを目指しています。

また、このアプリは「ユーザーがアーティストをフォローする」「おすすめに楽曲が紐づく」といった、データ同士の「関係性」が重要であることから、RDBMS である MySQL を採用しました。

![ER図](docs/assets/er-diagram.png)

<br>

---

## テスト

### ユニットテスト

本アプリケーションのバックエンドは、リファクタリング後の動作を保証するため、一部 Jest を用いた単体テスト（ユニットテスト）を導入しました。現在は、外部に依存しない純粋なビジネスロジック（バリデーション、ドメインモデルなど）を中心にテストを記述しており、これによりリファクタリングを安全に行えるようにしました。

今後の課題として、より複雑で重要な「レコメンドの保存処理」など、データベースに依存するロジックに対しても、モックを活用したテストを導入する予定です。

<br>

> 主なテストコード

- [virtualSourceArtistFactory.test.ts](backend/src/domain/factories/virtualSourceArtistFactory.test.ts)：楽曲選定ロジックの核となる「仮想ソースアーティスト」生成関数のテスト

<br>

- [followings.test.ts](backend/src/domain/valueObjects/followings.test.ts)：ドメイン知識に基づいた複雑な条件分岐を持つメソッドのテスト

<br>

- [validation.test.ts](backend/src/presentation/utils/validation.test.ts)：不正なリクエストデータがビジネスロジックに渡らないことを保証する、バリデーション関数のテスト

<br>

### ユーザーテストによる「フィードバック」と「学び」

本アプリは完成後、自身の Instagram のサブアカウントを通じて、**友人・知人約 70 名**を対象に限定的な公開（ユーザーテスト）とフィードバックの募集を行いました。<br>

その結果、**12 名から「ぜひ使ってみたい」というポジティブな反応**があり、**1 名の友人には、実際にログインしてアプリを利用**してもらうことができました。<br>

しかし、「SoundCloud は日本のアーティスト少ない」「コア機能であるレコメンドに至るまでの手順が多い」という理由で、**実際に使ってほしい「コア機能」まで到達してもらうことができませんでした**。この経験から、**コア機能までのステップが簡単でなければ、ユーザーに価値を届けることすらできない**という、UX 設計の重要性を身をもって学びました。

<br>

---

## こだわったところ

### OAuth 2.1 (PKCE) と セッション管理

SoundCloud API の利用には、OAuth 2.1 の PKCE フローが必須でした。<br>

Web アプリケーションで取得したアクセストークンは、フロントエンドの`localStorage`に保存するのが一般的な実装例の一つです。しかし、`localStorage` は JavaScript から簡単にアクセスできるため、もし XSS 攻撃が成功した場合、攻撃者のスクリプトによってトークンが盗み出されてしまうという脆弱性があります。<br>

そのため、私はこの「**XSS によるトークン盗難**」**リスクを避けることが、必要だと判断しました**。<br>

そこで、アクセストークンはフロントエンドで管理せず、すべてバックエンド（Redis）で管理する設計にしました。フロントエンドとの通信は、JavaScript からは読み取れない**HttpOnly 属性を付与した Cookie**のみで行い、SoundCloud API との通信はすべてバックエンド側で行うことで、この XSS リスクを回避しています。<br>

SoundCloud API Guide： https://developers.soundcloud.com/docs/api/guide

#### 【具体例】

- **トークンをバックエンドで管理：**<br>
  PKCE のフローに従い、フロントエンドは認可コード（`code`）を取得する役割のみを担います。取得した認可コードは一度だけバックエンドに送信され、**アクセストークンへの交換処理と、その後の管理は全てバックエンドで完結**させます。

- **HttpOnly Cookie によるセッション管理：**<br>
  バックエンドでセッション ID を発行し、`HttpOnly` **属性を付与した Cookie** としてフロントエンドに返却します。このセッション ID をキーとして、実際のアクセストークンやユーザー ID はサーバー側の **Redis** に保存し、同時に **Redis の TTL（有効期限）機能でセッションのライフタイムも管理**しています。以降、フロントエンドからのリクエストは、この Cookie を元にサーバー側でユーザーログイン状態を確認し、SoundCloud API との通信は全てバックエンドが代理で行います。

> より具体的な認証フローは以下をご覧ください

- [auth-flow.md](docs/specifications/auth-flow.md)

<br>

> 主な関連コード

※ これらのファイルから処理の流れを追えます

- Backend
  - [authorizeUserUseCase.ts](backend/src/application/usecase/authorizeUserUseCase.ts)
- Frontend
  - [Login.tsx](frontend/src/pages/Login.tsx)
  - [Callback.tsx](frontend/src/pages/Callback.tsx)

<br>

### ディグを手軽に行うための、楽曲選定ロジック

このアプリのレコメンド機能は、「**ディグ = 深掘り**」の効率化という目的のため、「1 人のアーティストのいいね一覧を深掘りする」というコンセプトで設計しました。<br>

しかし、この「深掘り」を実現するには、ソースとしてある程度の楽曲数（例: 100 曲以上）が必要だと考えました。このルールを厳格に適用すると、「いいね」が少ないアーティストをフォローしているユーザーは、**レコメンドのソースとして選ばれるアーティストが極端に少なくなる**（毎回同じソースしか選ばれない）という**第一の課題**に直面しました。<br>

かといって、この課題を解決するために「いいねが少ない 5 人のアーティストから、20 曲ずつ取ってくる」という方法も考えられますが、それではアプリの大前提である「**1 人のアーティストを深掘りする**」というコンセプトが失われてしまうという、**第二の課題**に直面しました。<br>

そこで、この**相反する第一と第二の課題を両立する折衷案**として、複数のアーティストをプログラム上で束ねる、「**仮想ソースアーティスト**」という独自の概念を考案・実装しました。<br>

#### 【具体例】

- **「いいね」が少ないアーティストを「束ねる」:**<br>
  まず、フォロー中のアーティストを「いいね」の数で分類します。100 件未満 20 曲以上のアーティストをランダムに 5 人ずつグルーピングし、これを一人の「**仮想ソースアーティスト**」と見なします。これにより、個々の「いいね」は少なくても、合計で **100 曲以上の楽曲ソースを安定的に確保**できるようになりました。

- **1 人のアーティストのいいね一覧を「深掘る」:**<br>
  ソースは、「十分な楽曲数を持つ単独ソースアーティスト」と、「仮想ソースアーティスト」が入り混じるソースアーティスト群の中から**一人をランダムに選ぶ**設計にしました。これにより、単一アーティストの「いいね」一覧、または「仮想ソースアーティスト」の「いいね」一覧のいずれかを深掘りする形となり、アプリのコンセプトとの一貫性を持たせました。<br>

  同時にこの方式は、「仮想ソースアーティスト」が選ばれた場合でも、その構成人数（最大 5 人）が API 呼び出し回数の上限となるため、レスポンスの極端な悪化を防いでいます。

> レコメンドアルゴリズムの詳しい説明は以下をご覧ください

- [recommendations-flow.md](docs/specifications/recommendations-flow.md)

<br>

> 主な関連コード

※ このファイルから処理の流れを追えます

- [getRecommendationUseCase.ts](backend/src/application/usecase/getRecommendationUseCase.ts)

<br>

## 今後の開発について

実際にアプリケーションを運用する中で、Azure for Students の特典により無料だと想定していた Azure DataBase for MySQL が、一定の**I/O**操作を超えると従量課金されることに気づきました。これが将来的なコスト面の課題になると考え、まずパフォーマンス改善を通して、この課題に取り組みたいと考えています。

- SQL の最適化による DB I/O の削減<br>
  クエリを最適化し、非効率なデータの取得を解消することで、データベースに対する不要な I/O を削減します。

- キャッシュによる DB I/O の抑制<br>
  更新頻度の低いデータは Redis にキャッシュすることで、DB への I/O をさらに抑制し、 I/O を削減します。
