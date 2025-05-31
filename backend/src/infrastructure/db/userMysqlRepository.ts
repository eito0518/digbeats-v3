import { UserDbRepository } from "../../domain/interfaces/userDbRepository";
import { MysqlClient } from "./mysqlClient";
import mysql from "mysql2/promise";

export class UserMysqlRepository implements UserDbRepository {
  // 外部IDからユーザーIDを取得
  async findUserIdByExternalId(
    soundcloudUserId: number
  ): Promise<number | undefined> {
    try {
      const [userSelectResults] = await MysqlClient.execute<
        mysql.RowDataPacket[]
      >("SELECT id FROM users WHERE soundcloud_user_id = ?", [
        soundcloudUserId,
      ]);

      // ユーザーが未登録ならば undefined を返す
      if (userSelectResults.length === 0) {
        return undefined;
      }

      // ユーザーが登録済みならば userId を返す
      return userSelectResults[0].id;
    } catch (error) {
      const message =
        "Failed to find user by external ID: unable to access database";
      console.error(`[userMysqlRepository] ${message}`, error);
      throw new Error(message);
    }
  }

  // ユーザーを新規登録
  async createUser(soundCloudUserId: number): Promise<number> {
    try {
      const [userInsertResults] =
        await MysqlClient.execute<mysql.ResultSetHeader>(
          "INSERT INTO users (soundcloud_user_id) VALUES (?)",
          [soundCloudUserId]
        );

      // 登録した userId　を返す
      return userInsertResults.insertId;
    } catch (error) {
      const message =
        "Failed to create user: insert operation on users table failed";
      console.error(`[userMysqlRepository] ${message}`, error);
      throw new Error(message);
    }
  }
}
