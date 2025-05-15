import { ArtistInfo } from "../../domain/valueObjects/artistInfo";
import mysql from "mysql2/promise";

export class ArtistMysqlRepository {
  // アーティストの存在確認と保存
  async findOrCreateId(
    transactionConn: mysql.PoolConnection,
    artist: ArtistInfo
  ): Promise<number> {
    try {
      // DBからアーティストを探す
      const [artistSelectResults] = await transactionConn.execute<
        mysql.RowDataPacket[]
      >("SELECT id FROM artists WHERE soundcloud_artist_id = ?", [
        artist.externalUserId,
      ]);

      // アーティストが登録済みならば artistId を返す
      if (artistSelectResults[0]) {
        return artistSelectResults[0].id;
      }

      // ユーザーが未登録ならば INSERT
      const [artistInsertResults] =
        await transactionConn.execute<mysql.ResultSetHeader>(
          "INSERT INTO artists (soundcloud_artist_id) values (?)",
          [artist.externalUserId]
        );

      // artistId を返す
      return artistInsertResults.insertId;
    } catch (error) {
      console.error("findOrCreateArtistId request failed:", error);
      throw new Error("FindOrCreateArtistId request failed");
    }
  }
}
