import { RecommendationRepository } from "../../domain/interfaces/recommendationDbRepository";
import { ArtistMysqlRepository } from "./artistMysqlRepository";
import { TrackMysqlRepository } from "./trackMysqlRepository";
import { Recommendation } from "../../domain/entities/recommendation";
import { MysqlClient } from "./mysqlClient";
import mysql from "mysql2/promise";
import { Track } from "../../domain/entities/track";

export class RecommendationMySQLRepository implements RecommendationRepository {
  constructor(
    private readonly _artistMysqlRepository: ArtistMysqlRepository,
    private readonly _trackMysqlRepository: TrackMysqlRepository
  ) {}

  // レコメンドを保存してIDを付与する
  async saveAndReturnWithId(
    recommendation: Recommendation
  ): Promise<Recommendation> {
    // poolから専用コネクションを取得
    const transactionConn = await MysqlClient.getConnection();

    try {
      // トランザクション開始
      await transactionConn.beginTransaction();

      // テーブル間の依存関係に従って、順番に取得または保存
      //　　IDが付与された楽曲を 取得または保存
      const savedTracks: Track[] = await Promise.all(
        recommendation.tracks.map(async (track) => {
          // DBに アーティスト が存在するか確認し、なければ保存
          const artistId = await this._artistMysqlRepository.findOrCreateId(
            transactionConn,
            track.artist
          );
          // DBに 楽曲 が存在するか確認し、なければ保存
          const trackId = await this._trackMysqlRepository.findOrCreateId(
            transactionConn,
            track,
            artistId
          );
          // IDが付与された楽曲　を返す
          return track.withId(trackId); // IDを付与
        })
      );

      // 楽曲IDを取得
      const trackIds = savedTracks.map((track) => track.requireId());

      // レコメンドを保存
      const [recommendationInsertResults] =
        await transactionConn.execute<mysql.ResultSetHeader>(
          "INSERT INTO recommendations (user_id) VALUES (?)",
          [recommendation.userId]
        );

      // レコメンドIDを取得
      const recommendationId = recommendationInsertResults.insertId;

      // 中間テーブル （レコメンド・楽曲） に保存
      await Promise.all(
        trackIds.map(async (trackId) => {
          await transactionConn.execute<mysql.ResultSetHeader>(
            "INSERT INTO recommendations_tracks (recommendation_id, track_id, is_liked) VALUES (?, ?, false)",
            [recommendationId, trackId]
          );
        })
      );

      // トランザクション終了
      await transactionConn.commit();

      // レコメンド作成日時を取得
      const [recommendationSelectResults] = await transactionConn.execute<
        mysql.RowDataPacket[]
      >("SELECT created_at FROM recommendations WHERE id = ?", [
        recommendationId,
      ]);

      const createdAt = recommendationSelectResults[0].created_at;

      // レコメンドにIDを付与して返す
      return recommendation.withPersistenceInfo(
        recommendationId, // IDを付与
        savedTracks, // IDが付与された楽曲に差し替え
        createdAt // 作成日時を付与
      );
    } catch (error) {
      // 失敗時にロールバック
      if (transactionConn) {
        try {
          await transactionConn.rollback();
        } catch (rollbackError) {
          console.error(
            `[recommendationMysqlRepository] Failed to rollback transaction`,
            rollbackError
          );
        }
      }

      const message = `Failed to save recommendation (userId: ${recommendation.userId}): unable to communicate with MySQL`;
      console.error(`[recommendationMysqlRepository] ${message}`, error);
      throw new Error(message);
    } finally {
      // コネクションを開放
      if (transactionConn) {
        try {
          transactionConn.release();
        } catch (releaseError) {
          console.error(
            `[recommendationMysqlRepository] Failed to release MySQL connection`,
            releaseError
          );
        }
      }
    }
  }
}
