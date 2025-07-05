import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { createApp } from "./app";
import { config } from "./config/config";

const app = createApp();
const port = config.PORT;

// NODE_ENVの値によって起動するサーバーを切り替える
if (config.NODE_ENV === "production") {
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
    const keyPath = path.join(
      __dirname,
      "../config/cert.dev/localhost-key.pem"
    );
    const certPath = path.join(__dirname, "../config/cert.dev/localhost.pem");

    const key = fs.readFileSync(keyPath);
    const cert = fs.readFileSync(certPath);

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
