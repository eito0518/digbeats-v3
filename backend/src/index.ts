import http from "http";
import https from "https";
import fs from "fs";
import { createApp } from "./app";

const app = createApp();
const port = process.env.PORT;

// NODE_ENVの値によって起動するサーバーを切り替える
if (process.env.NODE_ENV === "production") {
  // 本番環境(Azure)の場合
  // AzureAppServiceがSSL認証を行うため HTTP で起動
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`HTTP Server running for production on port ${port}`);
  });
} else {
  // 開発環境（ローカル）の場合
  // 自作のSSL証明書ファイルを読み込む
  try {
    const key = fs.readFileSync("../cert/localhost-key.pem");
    const cert = fs.readFileSync("../cert/localhost.pem");

    // 自作のSSL証明書を使用するため HTTPS で起動
    const httpsServer = https.createServer({ key, cert }, app);
    httpsServer.listen(port, () => {
      console.log(
        `HTTPS Server running for development at https://localhost:${port}`
      );
    });
  } catch (error) {
    console.error(
      "ERROR: Could not start HTTPS server for development. SSL certificates not found."
    );
  }
}
