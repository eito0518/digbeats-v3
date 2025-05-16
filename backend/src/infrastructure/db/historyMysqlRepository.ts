import { HistoryRepository } from "../../domain/interfaces/historyRepository";
import { RecommendationRecord } from "../../domain/entities/recommendationRecord";
import { MysqlClient } from "./mysqlClient";
import mysql from "mysql2/promise";
import { RecordedTrack } from "../../domain/entities/recordedTrack";

export class HistoryMysqlRepository implements HistoryRepository {
  // レコメンド履歴を取得
  async get(userId: number, limit: number): Promise<RecommendationRecord[]> {
    try {
      // DBからレコメンド履歴を取得する
      const [selectRecommendationsResults] = await MysqlClient.execute<
        mysql.RowDataPacket[]
      >(
        `
        SELECT 
            r.id AS recommendationId, 
            r.created_at AS recommendedAt, 
            t.id AS trackId, 
            t.permalink_url AS permalinkUrl,
            rt.was_liked AS wasLiked
        FROM recommendations AS r
        JOIN recommendations_tracks AS rt
            ON r.id = rt.recommendations_id
        JOIN tracks AS t
            ON rt.tracks_id = t.id
        WHERE r.user_id = ? 
        ORDER BY r.created_at DESC 
        LIMIT ?
        `,
        [userId, limit * 10] // レコメンド数 × 楽曲数（１レコメンドあたり必ず10曲）
      );

      //　レコメンドIDでグループ分け
      // 空の入れ物を用意
      const groupedRecommendaions = new Map<
        number, // キー (recommendationId)
        { recommendedAt: string; tracks: RecordedTrack[] } // バリュー
      >();

      selectRecommendationsResults[0].forEach((r: any) => {
        // レコメンドから楽曲を1つ取り出す
        const track = new RecordedTrack(r.trackId, r.permalinkUrl, r.wasLiked);
        // すでに同じレコメンドIDがある場合
        if (groupedRecommendaions.has(r.recommendationId)) {
          // そこのtracksに楽曲を追加
          groupedRecommendaions.get(r.recommendationId)?.tracks.push(track);
        }
        // 初めてのレコメンドIDの場合
        else {
          // キーとバリューを新しくセット
          groupedRecommendaions.set(r.recommendationId, {
            recommendedAt: r.recommendedAt,
            tracks: [track],
          });
        }
      });

      // Map型からレコメンド履歴エンティティに変換
      const recommendationsHistory = Array.from(
        groupedRecommendaions.entries()
      ).map(
        // ２段階の分割代入
        ([id, { recommendedAt, tracks }]) =>
          new RecommendationRecord(id, recommendedAt, tracks)
      );

      return recommendationsHistory;
    } catch (error) {
      console.error("getHistory request failed:", error);
      throw new Error("GetHistory request failed");
    }
  }
}
