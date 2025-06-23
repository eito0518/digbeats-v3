import { config } from "../../config/config";
import { TrackDbRepository } from "../../domain/interfaces/trackDbRepository";
import mysql from "mysql2/promise";
import { Track } from "../../domain/entities/track";
import { MysqlClient } from "./mysqlClient";

const defaultArtworkUrl =
  config.NODE_ENV === "development"
    ? "https://localhost:3000/default-artwork.png"
    : "https://app.digbeats.jp/default-artwork.png";

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

      // 楽曲が登録済みの場合は trackId を返す
      if (trackSelectResults.length > 0 && trackSelectResults[0].id) {
        return trackSelectResults[0].id;
      }

      // 楽曲が未登録の場合は登録する
      try {
        const [trackInsertResults] =
          await transactionConn.execute<mysql.ResultSetHeader>(
            "INSERT INTO tracks (artist_id, soundcloud_track_id, title, artwork_url, permalink_url) values (?, ?, ?, ?, ?)",
            [
              artistId,
              track.externalTrackId,
              track.title,
              track.artworkUrl || defaultArtworkUrl, // 存在しない場合はデフォルト画像をDBに保存
              track.permalinkUrl,
            ]
          );

        // 登録に成功した場合は trackId を返す
        return trackInsertResults.insertId;
      } catch (insertError: any) {
        // 登録に失敗した場合の処理
        // MySQLの「重複エントリ」エラー(ER_DUP_ENTRY)の場合
        if (insertError.code === "ER_DUP_ENTRY") {
          console.warn(
            `[TrackMysqlRepository] Duplicate entry for soundcloudTrackId: ${track.externalTrackId}. Retrying select.`
          );

          // 再度 soundcloudTrackId を取得に挑戦
          const [retrySelectResults] = await transactionConn.execute<
            mysql.RowDataPacket[]
          >("SELECT id FROM tracks WHERE soundcloud_track_id = ?", [
            track.externalTrackId,
          ]);

          // 楽曲が登録済みの場合は trackId を返す
          if (retrySelectResults.length > 0 && retrySelectResults[0].id) {
            return retrySelectResults[0].id;
          } else {
            // 想定ではここには来ないはずであるが
            const criticalMessage = `Failed to find track (soundcloudTrackId: ${track.externalTrackId}) after ER_DUP_ENTRY. This indicates a critical issue.`;
            console.error(
              `[TrackMysqlRepository] ${criticalMessage}`,
              insertError
            );
            throw new Error(criticalMessage);
          }
        } else {
          // 重複エラー以外の場合はそのままエラーを次に伝える
          console.error(
            `[TrackMysqlRepository] Non-duplicate insert error for soundcloudTrackId: ${track.externalTrackId}`,
            insertError
          );
          throw insertError;
        }
      }
    } catch (error) {
      // その他の予期せぬエラー
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
