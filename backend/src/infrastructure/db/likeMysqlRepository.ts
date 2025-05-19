import { MysqlClient } from "./mysqlClient";
import mysql from "mysql2/promise";

export class LikeMysqlRepository {
  // いいねを記録
  async save(recommendationId: number, trackId: number): Promise<void> {
    try {
      const [updateLikeResult] =
        await MysqlClient.execute<mysql.ResultSetHeader>(
          `
        UPDATE recommendations_tracks 
        SET was_liked = TRUE 
        WHERE recommendations_id = ? AND tracks_id = ?
        `,
          [recommendationId, trackId]
        );

      if (updateLikeResult.affectedRows === 0) {
        console.error(
          `matching record not found: recommendationId=${recommendationId}, trackId=${trackId}`
        );
        throw new Error("Matching record not found");
      }
    } catch (error) {
      console.error("save like request failed:", error);
      throw new Error("Save Like request failed");
    }
  }
}
