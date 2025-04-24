import {
  UserDbRepository,
  FindUserBySoundCloudUserIdResponse,
} from "../../domain/interfaces/userDbRepository";
import { config } from "../../config/config";
import axios from "axios";

export class UserMysqlRepository implements UserDbRepository {
  // ユーザー情報を取得
  async findUserBySoundCloudUserId(soundCloudUserId: string): Promise<FindUserBySoundCloudUserIdResponse>; {
    try {
      const userSelectResults = await connect.execute<>(
        "SELECT "
      )

      return {
        userId: userSelectResults.
      };
    } catch (error) {
      console.error("getUser request failed:", error);
      throw new Error("getUser request failed");
    }
  }
}
