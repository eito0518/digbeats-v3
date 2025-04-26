import {
  UserDbRepository,
  FindUserByExternalIdResponse,
  CreateUserResponse,
} from "../../domain/interfaces/userDbRepository";
import { MysqlClient } from "./mysqlClient";
import mysql from "mysql2/promise";

export class UserMysqlRepository implements UserDbRepository {
  // ユーザー情報を取得
  async findUserByExternalId(
    soundCloudUserId: string
  ): Promise<FindUserByExternalIdResponse | undefined> {
    try {
      const [userSelectResults] = await MysqlClient.execute<
        mysql.RowDataPacket[]
      >("SELECT id FROM users WHERE soundcloud_user_id = ?", [
        soundCloudUserId,
      ]);

      // ユーザーが未登録であれば undefined を返す
      if (!userSelectResults) {
        return undefined;
      }

      // ユーザーが登録済みであれば userId を返す
      return {
        userId: userSelectResults[0].id,
      };
    } catch (error) {
      console.error("FindUserByExternalId request failed:", error);
      throw new Error("findUserByExternalId request failed");
    }
  }

  // ユーザーを新規登録
  async createUser(soundCloudUserId: string): Promise<CreateUserResponse> {
    try {
      const [userInsertResults] =
        await MysqlClient.execute<mysql.ResultSetHeader>(
          "INSERT INTO users (soundcloud_user_id) VALUES (?)",
          [soundCloudUserId]
        );

      return {
        userId: userInsertResults.insertId,
      };
    } catch (error) {
      console.error("CreateUser request failed:", error);
      throw new Error("createUser request failed");
    }
  }
}
