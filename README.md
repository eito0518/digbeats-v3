# 🎧 DigBeats-v3 - Demo 版 開発まとめ

## 🧠 概要

**DigBeats-v3** は、SoundCloud API を用いて「自分がフォローしているユーザーが 'いいね' した楽曲」をもとに、レコメンド体験を提供する Web アプリです。

Spotify ベースだった v1、Last.fm/KKBOX ベースの v2 に続き、v3 では SoundCloud + OAuth2.1 + PKCE + Redis + Cookie セッション構成に挑戦。**実践的なセキュリティ・API 設計・セッション管理の練習**を重視して構築しました。

---

## 🚀 技術スタック

| 分類           | 技術構成                             |
| -------------- | ------------------------------------ |
| フロントエンド | Vite + React + TypeScript            |
| バックエンド   | Express + TypeScript                 |
| セッション管理 | Redis + Cookie（HTTP Only + Secure） |
| セキュア通信   | HTTPS（mkcert + localhost 証明書）   |

---

## ✅ 実装済み機能まとめ

### 🔐 SoundCloud OAuth2.1 + PKCE 構成

- フロントで `code_verifier`・`state` を生成し、`sessionStorage` に一時保存
- 認可後、取得した `code` と `code_verifier` をバックエンドに送信
- バックエンドで access_token / refresh_token を取得し、Redis にセキュアに保存
- `code_verifier` の漏洩リスクと仕様上の制限についても検討し、フロントに短時間だけ保持する構成に

---

### 🧩 セッション管理とトークン保存（Redis + Cookie）

- 認証成功時に UUID ベースの `sessionId` を発行
- Redis に `{ access_token, refresh_token, accessTokenExpiresAt }` をまとめて保存
- クライアントには HTTP Only + Secure 属性付き Cookie で `sessionId` を返却
- フロントでは `withCredentials: true` を指定して Cookie を利用
- TTL の設定：
  - `refresh_token`: SoundCloud 仕様に準拠し、TTL = 172800 秒（2 日間）
  - `access_token`: レスポンスの `expires_in` に +60 秒の安全バッファをつけて管理
- セッション ID を除き、トークンは一切フロントに渡さない設計

---

### 🌐 HTTPS 開発環境構築

- `mkcert` により自己署名証明書（`localhost.pem`, `localhost-key.pem`）を作成
- `vite.config.ts` / `express` 両方で HTTPS 対応
- Chrome 警告（自己証明書による）は「localhost にアクセスする」で回避

---

### 👨‍💻 バックエンド API 実装

- `POST /api/auth/exchange`: 認可コードを使ってトークンを取得し、Redis に保存、セッション ID を Cookie で返却
- `GET /api/me/followings`: フォロー中アーティストの取得（SoundCloud API）
- `GET /api/users/:artistId/likes/tracks`: 各アーティストの「いいね曲」を 1 曲取得

---

## 🧭 実装予定 / 設計中の機能

### 🗂 レコメンド履歴保存（DB）【設計済み・未実装】

- **目的**：

  - おすすめ結果をあとから振り返れるように保存
  - DB 設計やポリシー遵守の練習も兼ねる

- **保存対象（設計方針）**：

  - `track_id`, `title`, `url`, `recommended_at`
  - 公開されているメタ情報に限定
  - 「誰が like したか」は保存しない設計でプライバシーにも配慮

- **公開範囲**：
  - 自分 or 私から許可されたユーザー　だけが閲覧可能な非公開設計
  - 商用利用しないため、SoundCloud の開発者ポリシーにも準拠

---

### 🎨 TailwindCSS による UI 構築【未導入】

- TailwindCSS を導入予定（現在は未使用）
- 初期構成・不要ファイルの削除は完了済み（`App.css`, `vite.svg`など）

---

### 🎵 おすすめ楽曲のランダム表示【未実装】

- 複数の「いいね曲」からランダムで 曲を選んで表示予定

---

## 📌 現在の動作確認ポイント

- ✅ SoundCloud OAuth2.1 認証 → セッション保存 → sessionId を Cookie で返却
- ✅ HTTPS 開発環境でフロント・バックとも通信成功
- ✅ フォロー中アーティスト取得（/api/me/followings）
- ✅ 一部アーティストの like 曲取得（/api/users/:artistId/likes/tracks）

---

## 🧭 今後の予定

- レコメンド履歴保存機能（MySQL または PostgreSQL）
- `/api/me/recommendations` API の実装
- おすすめ曲のランダム抽出＆表示処理
- UI のスタイル整備（TailwindCSS 導入）
- Like 機能の SoundCloud API 連携

---

## 👤 開発者向け補足メモ

- クライアントでは `sessionStorage` に `sessionId` を一時的に保持
- セッション ID は HTTP Only + Secure 属性付き Cookie でやり取り
- コールバック URL の都合上、フロントとバックエンドはどちらも HTTPS（localhost:3000 / 4000）で統一済み

---
