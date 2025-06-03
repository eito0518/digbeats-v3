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

      // ユーザーが未登録ならば 登録する
      const [artistInsertResults] =
        await transactionConn.execute<mysql.ResultSetHeader>(
          "INSERT INTO artists (soundcloud_artist_id, name, avatar_url, permalink_url) values (?, ?, ?, ?)",
          [
            artist.externalUserId,
            artist.name,
            artist.avatarUrl,
            artist.permalinkUrl,
          ]
        );

      // artistId を返す
      return artistInsertResults.insertId;
    } catch (error) {
      const message = `Failed to find or create artist (soundcloudArtistId: ${artist.externalUserId}): unable to communicate with MySQL`;
      console.error(`[artistMysqlRepository] ${message}`, error);
      throw new Error(message);
    }
  }
}
