import mysql from "mysql2/promise";
import { config } from "../../config/config";

export const MysqlClient = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
  timezone: "+00:00",
  waitForConnections: true,
  connectionLimit: 10,
});
