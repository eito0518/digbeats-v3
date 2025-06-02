import { TodayRecommendationDbRepository } from "../../domain/interfaces/todayRecommendationDbRepository";
import { Recommendation } from "../../domain/entities/recommendation";
import { MysqlClient } from "./mysqlClient";
import mysql from "mysql2/promise";
import { Track } from "../../domain/entities/track";
import { ArtistInfo } from "../../domain/valueObjects/artistInfo";

export class TodayRecommendationMysqlRepository
  implements TodayRecommendationDbRepository
{
  // 「今日のレコメンド」 を取得する
  async get(userId: number, limit: number): Promise<Recommendation[]> {
    try {
      // DBから 「今日のレコメンド」 を取得する
      const [selectRecommendationsResults] = await MysqlClient.execute<
        mysql.RowDataPacket[]
      >(
        `
          SELECT 
              r.id AS recommendationId, 
              r.created_at AS recommendedAt, 
              t.id AS trackId,
              t.soundcloud_track_id AS soundcloudTrackId, 
              t.title AS title,
              t.artwork_url AS artworkUrl,
              t.permalink_url AS trackPermalinkUrl,
              a.id AS artistId,
              a.soundcloud_artist_id AS soundcloudArtistId,
              a.name AS name,
              a.avatar_url AS avatarUrl,
              a.permalink_url AS artistPermalinkUrl
          FROM recommendations AS r
          JOIN recommendations_tracks AS rt
              ON r.id = rt.recommendations_id
          JOIN tracks AS t
              ON rt.tracks_id = t.id
          JOIN artists AS a
              ON t.artist_id = a.id  
          WHERE r.user_id = ? 
              AND r.created_at >= CURDATE() 
              AND r.created_at < CURDATE() + INTERVAL 1 DAY
          ORDER BY r.created_at DESC 
          LIMIT ?
          `,
        [userId, limit]
      );

      //　レコメンドIDで取得したレコメンドをグループ分け
      // 空の入れ物　（MAP型）　を用意
      const groupedRecommendaions = new Map<
        number, // キー (recommendationId)
        { recommendedAt: string; tracks: Track[] } // バリュー (日時　と 楽曲)
      >();

      selectRecommendationsResults.forEach((r: any) => {
        // レコメンドから楽曲を1つ取り出す
        const track = new Track(
          r.soundcloudTrackId,
          r.title,
          r.artworkUrl,
          r.trackPermalinkUrl,
          new ArtistInfo(
            r.soundcloudArtistId,
            r.name,
            r.avatarUrl,
            r.artistPermalinkUrl,
            undefined
          ),
          r.trackId
        );
        // 同じレコメンドIDが既にある場合
        if (groupedRecommendaions.has(r.recommendationId)) {
          // そのレコメンドIDのtracksに楽曲を追加
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

      // Map型　から　Recommendation[] に変換
      const todayRecommendations = Array.from(
        groupedRecommendaions.entries()
      ).map(
        // ２段階の分割代入　で取り出してから変換する
        ([id, { recommendedAt, tracks }]) =>
          new Recommendation(userId, tracks, id, recommendedAt)
      );

      return todayRecommendations;
    } catch (error) {
      const message = `Failed to fetch today's recommendations (userId: ${userId}): unable to communicate with MySQL`;
      console.error(`[todayRecommendationMysqlRepository] ${message}`, error);
      throw new Error(message);
    }
  }
}
