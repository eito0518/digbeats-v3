import { TrackInfo } from "../../domain/valueObjects/trackInfo";
import mysql from "mysql2/promise";

export class TrackMysqlRepository {
  // 楽曲の存在確認と保存
  async findOrCreateId(
    transactionConn: mysql.PoolConnection,
    track: TrackInfo,
    artistId: number // 内部のID
  ): Promise<number> {
    try {
      // 楽曲を探す
      const [trackSelectResults] = await transactionConn.execute<
        mysql.RowDataPacket[]
      >("SELECT id FROM tracks WHERE soundcloud_track_id = ?", [
        track.externalTrackId,
      ]);

      // 楽曲が登録済みならば trackId を返す
      if (trackSelectResults[0]) {
        return trackSelectResults[0].id;
      }

      // 楽曲が未登録ならば INSERT
      const [trackInsertResults] =
        await transactionConn.execute<mysql.ResultSetHeader>(
          "INSERT INTO tracks (artist_id, soundcloud_track_id, permalink_url) values (?, ?, ?)",
          [artistId, track.externalTrackId, track.permalinkUrl]
        );

      // trackId を返す
      return trackInsertResults.insertId;
    } catch (error) {
      console.error("findOrCreateTrackId request failed:", error);
      throw new Error("FindOrCreateTrackId request failed");
    }
  }
}
