import { RecommendationDbRepository } from "../../domain/interfaces/recommendationDbRepository";
import { ArtistMysqlRepository } from "./artistMysqlRepository";
import { TrackMysqlRepository } from "./tracksMysqlRepository";
import { Recommendation } from "../../domain/entities/recommendation";
import { MysqlClient } from "./mysqlClient";
import mysql from "mysql2/promise";

export class RecommendationMySQLRepository
  implements RecommendationDbRepository
{
  constructor(
    private readonly _artistMysqlRepository: ArtistMysqlRepository,
    private readonly _trackMysqlRepository: TrackMysqlRepository
  ) {}

  // レコメンドを作成
  async saveAndReturnWithId(
    recommendation: Recommendation
  ): Promise<Recommendation> {
    // poolから専用コネクションを取得
    const transactionConn = await MysqlClient.getConnection();

    try {
      // トランザクション開始
      await transactionConn.beginTransaction();

      // テーブル間の依存関係に従って順番にIDを取得または保存
      //　　楽曲IDを取得
      const trackIds: number[] = await Promise.all(
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
          // 楽曲ID を返す
          return trackId;
        })
      );

      // レコメンドを保存
      const [recommendationInsertResults] =
        await transactionConn.execute<mysql.ResultSetHeader>(
          "INSERT INTO recommendations (user_id) VALUES (?)",
          [recommendation.userId]
        );

      // レコメンドIDを取得
      const recommendationId = recommendationInsertResults.insertId;

      // 中間テーブルを保存
      await Promise.all(
        trackIds.map(async (trackId) => {
          await transactionConn.execute<mysql.ResultSetHeader>(
            "INSERT INTO recommendations_tracks (recommendations_id, tracks_id, liked) VALUES (?, ?, false)",
            [recommendationId, trackId]
          );
        })
      );

      // トランザクション終了
      await transactionConn.commit();

      // レコメンドエンティティにIDを付与して返す
      return new Recommendation(
        recommendation.userId,
        recommendation.tracks,
        recommendationId // IDを付与
      );
    } catch (error) {
      // 失敗時にロールバック
      if (transactionConn) {
        try {
          await transactionConn.rollback();
        } catch (rollbackError) {
          console.error("rollback failed:", rollbackError);
        }
      }

      console.error("Recommendation: saveAndReturnWithId failed:", error);
      throw new Error("Recommendation: SaveAndReturnWithId request failed");
    } finally {
      // コネクションを開放
      if (transactionConn) {
        try {
          transactionConn.release();
        } catch (releaseError) {
          console.error("connection release failed:", releaseError);
        }
      }
    }
  }
}
