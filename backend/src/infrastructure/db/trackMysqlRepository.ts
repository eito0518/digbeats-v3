import { TrackDbRepository } from "../../domain/interfaces/trackDbRepository";
import mysql from "mysql2/promise";
import { Track } from "../../domain/entities/track";
import { MysqlClient } from "./mysqlClient";

export class TrackMysqlRepository implements TrackDbRepository {
  // 楽曲の存在確認と保存
  async findOrCreateId(
    transactionConn: mysql.PoolConnection,
    track: Track,
    artistId: number // 内部のID
  ): Promise<number> {
    try {
      // DBから楽曲を探す
      const [trackSelectResults] = await transactionConn.execute<
        mysql.RowDataPacket[]
      >("SELECT id FROM tracks WHERE soundcloud_track_id = ?", [
        track.externalTrackId,
      ]);

      // 楽曲が登録済みならば trackId を返す
      if (trackSelectResults[0]) {
        return trackSelectResults[0].id;
      }

      // 楽曲が未登録ならば 登録する
      const [trackInsertResults] =
        await transactionConn.execute<mysql.ResultSetHeader>(
          "INSERT INTO tracks (artist_id, soundcloud_track_id, title, artwork_url, permalink_url) values (?, ?, ?, ?, ?)",
          [
            artistId,
            track.externalTrackId,
            track.title,
            track.artworkUrl,
            track.permalinkUrl,
          ]
        );

      // trackId を返す
      return trackInsertResults.insertId;
    } catch (error) {
      const message = `Failed to find or create track (soundcloudTrackId: ${track.externalTrackId}, artistId: ${artistId}): unable to communicate with MySQL`;
      console.error(`[trackMysqlRepository] ${message}`, error);
      throw new Error(message);
    }
  }

  // トラックIDから外部IDを取得する
  async getExternalTrackId(trackId: number): Promise<number> {
    try {
      const [trackSelectResults] = await MysqlClient.execute<
        mysql.RowDataPacket[]
      >("SELECT soundcloud_track_id FROM tracks WHERE id = ?", [trackId]);

      if (!trackSelectResults[0]) {
        const message = `No matching track found for internal trackId: ${trackId}`;
        console.error(`[trackMysqlRepository] ${message}`);
        throw new Error(message);
      }

      return trackSelectResults[0].soundcloud_track_id;
    } catch (error) {
      const message = `Failed to fetch soundcloudTrackId for internal trackId: ${trackId}`;
      console.error(`[trackMysqlRepository] ${message}`, error);
      throw new Error(message);
    }
  }
}
