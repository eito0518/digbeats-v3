import { config } from "../../config/config";
import { ArtistInfo } from "../../domain/valueObjects/artistInfo";
import mysql from "mysql2/promise";

const defaultAvatarUrl =
  config.NODE_ENV === "development"
    ? "https://localhost:3000/default-avatar.png"
    : "https://www.digbeats.jp/default-avatar.png";

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

      // アーティストが登録済みの場合は artistId を返す
      if (artistSelectResults.length > 0 && artistSelectResults[0].id) {
        return artistSelectResults[0].id;
      }

      // ユーザーが未登録の場合は登録する
      try {
        const [artistInsertResults] =
          await transactionConn.execute<mysql.ResultSetHeader>(
            "INSERT INTO artists (soundcloud_artist_id, name, avatar_url, permalink_url) values (?, ?, ?, ?)",
            [
              artist.externalUserId,
              artist.name,
              artist.avatarUrl || defaultAvatarUrl, // 存在しない場合はデフォルト画像をDBに保存
              artist.permalinkUrl,
            ]
          );

        // 登録に成功したら artistId を返す
        return artistInsertResults.insertId;
      } catch (insertError: any) {
        // 登録に失敗した場合の処理
        // MySQLの「重複エントリ」エラー(ER_DUP_ENTRY)の場合
        if (insertError.code === "ER_DUP_ENTRY") {
          console.warn(
            `[ArtistMysqlRepository] Duplicate entry for soundcloudArtistId: ${artist.externalUserId}. Retrying select.`
          );

          // 再度 soundcloudArtistId を取得に挑戦
          const [retryArtistSelectResults] = await transactionConn.execute<
            mysql.RowDataPacket[]
          >("SELECT id FROM artists WHERE soundcloud_artist_id = ?", [
            artist.externalUserId,
          ]);

          // アーティストが登録済みの場合は artistId を返す
          if (
            retryArtistSelectResults.length > 0 &&
            retryArtistSelectResults[0].id
          ) {
            return retryArtistSelectResults[0].id;
          } else {
            // 想定ではここには来ないはずであるが
            const criticalMessage = `Failed to find artist (soundcloudArtistId: ${artist.externalUserId}) after ER_DUP_ENTRY. This indicates a critical issue.`;
            console.error(
              `[ArtistMysqlRepository] ${criticalMessage}`,
              insertError
            );
            throw new Error(criticalMessage);
          }
        } else {
          // 重複エラー以外の場合はそのままエラーを次に伝える
          console.error(
            `[ArtistMysqlRepository] Non-duplicate insert error for soundcloudArtistId: ${artist.externalUserId}`,
            insertError
          );
          throw insertError;
        }
      }
    } catch (error) {
      // その他の予期せぬエラー
      const message = `Failed to find or create artist (soundcloudArtistId: ${artist.externalUserId}): unable to communicate with MySQL`;
      console.error(`[artistMysqlRepository] ${message}`, error);
      throw new Error(message);
    }
  }
}
