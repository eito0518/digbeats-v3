# 本番用
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

# ビルドステージからビルドされたものと、本番で必要なnode_modules、 package.json、 package-lock.jsonをコピー
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# 本番サーバーの起動コマンドを実行
CMD [ "npm", "run", "start" ]