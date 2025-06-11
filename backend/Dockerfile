# 本番環境
# マルチステージビルド

# ----- 1. ビルドステージ -----
# TypeScriptをJavaScriptにコンパイルするための環境を作成
# NodeとOSのバージョンをLTSで固定
FROM node:22.16.0-alpine3.22 AS builder

# コンテナ内の作業ディレクトリを指定
WORKDIR /usr/src/app

# 依存関係を先にインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピーしてビルドを実行
COPY . .
RUN npm run build


# ----- 2. 本番ステージ -----
# ビルドされたアプリケーションを実行するための新しい環境を作る
# NodeとOSのバージョンをLTSで固定
FROM node:22.16.0-alpine3.22

# コンテナ内の作業ディレクトリを指定
WORKDIR /usr/src/app

# 必要なpackage.jsonのみを先にコピー
COPY --from=builder /usr/src/app/package*.json ./

# 本番用の依存関係のみをインストール
RUN npm install --omit=dev

# ビルド成果物のみをコピー
COPY --from=builder /usr/src/app/dist ./dist

# 本番サーバーの起動コマンドを実行
CMD [ "npm", "run", "start" ]