import { UserDbRepository } from "../../domain/interfaces/userDbRepository";
import { MysqlClient } from "./mysqlClient";
import mysql from "mysql2/promise";

export class UserMysqlRepository implements UserDbRepository {
  // ユーザー情報を取得
  async findUserIdByExternalId(
    soundCloudUserId: number
  ): Promise<number | undefined> {
    try {
      const [userSelectResults] = await MysqlClient.execute<
        mysql.RowDataPacket[]
      >("SELECT id FROM users WHERE soundcloud_user_id = ?", [
        soundCloudUserId,
      ]);

      // ユーザーが未登録ならば undefined を返す
      if (!userSelectResults) {
        return undefined;
      }

      // ユーザーが登録済みならば userId を返す
      return userSelectResults[0].id;
    } catch (error) {
      console.error("FindUserByExternalId request failed:", error);
      throw new Error("findUserByExternalId request failed");
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
      console.error("CreateUser request failed:", error);
      throw new Error("createUser request failed");
    }
  }
}
