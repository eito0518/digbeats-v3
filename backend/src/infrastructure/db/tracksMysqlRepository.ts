import { TrackDbRepository } from "../../domain/interfaces/trackDbRepository";
import mysql from "mysql2/promise";
import { TrackInfo } from "../../domain/valueObjects/trackInfo";
import { MysqlClient } from "./mysqlClient";

export class TrackMysqlRepository implements TrackDbRepository {
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

  // soundcloudTrackIdを取得
  async getExternalTrackId(trackId: number): Promise<number> {
    try {
      const [trackSelectResults] = await MysqlClient.execute<
        mysql.RowDataPacket[]
      >("SELECT soundcloud_track_id FROM tracks WHERE id = ?", [trackId]);

      if (!trackSelectResults[0]) {
        console.error(`matching record not found: trackId=${trackId}`);
        throw new Error("Matching record not found");
      }

      return trackSelectResults[0].soundcloud_track_id;
    } catch (error) {
      console.error("getExternalTrackId request failed:", error);
      throw new Error("GetExternalTrackId request failed");
    }
  }
}
