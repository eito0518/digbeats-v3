import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { config } from "../../config/config";

const sslCertPath = path.join(
  __dirname, // 本番環境で実行中のファイルのディレクトリパス (/.../backend/dist/infrastructure/db))
  "../../../config/cert.prod/DigiCertGlobalRootG2.crt.pem" // そこからの相対パス
);

export const MysqlClient = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
  connectionLimit: 10,
  timezone: "+00:00",
  waitForConnections: true,
  // NODE_ENVの値によってSSl設定を切り替える
  ssl:
    config.NODE_ENV === "production"
      ? { ca: fs.readFileSync(sslCertPath) }
      : undefined,
});
