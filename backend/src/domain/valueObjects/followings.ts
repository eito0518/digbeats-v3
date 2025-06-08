import { ArtistInfo } from "./artistInfo";
import { RecommendationRequirementsNotMetError } from "../../errors/domain.errors";

export class Followings {
  constructor(private readonly _artists: ArtistInfo[]) {}

  //  レコメンド生成の条件を検証する
  public validateRecommendation(): void {
    // 条件1: いいね数が20以上のフォロー中アーティストが5人以上いるかどうか
    const qualifiedArtists = this._artists.filter(
      (artist) =>
        artist.likedTracksCount !== undefined && artist.likedTracksCount >= 20
    );

    if (qualifiedArtists.length < 5) {
      const message = `Insufficient qualified artists. Required: 5, Found: ${qualifiedArtists.length}`;
      throw new RecommendationRequirementsNotMetError(message);
    }

    // 条件2: フォロー中アーティスト全体のいいねトラック総数が100以上かどうか
    const totalLikedTracksCount = this._artists.reduce(
      (sum, artist) => sum + (artist.likedTracksCount || 0),
      0
    );

    if (totalLikedTracksCount < 100) {
      const message = `Insufficient total liked tracks. Required: 100, Found: ${totalLikedTracksCount}`;
      throw new RecommendationRequirementsNotMetError(message);
    }
  }

  // アーティストを いいね曲数 によって分類する
  classifyByPublicFavoritesCount() {
    const availableArtists = this._artists.filter(
      (artist) =>
        artist.likedTracksCount !== undefined && artist.likedTracksCount >= 100
    );

    const groupableArtists = this._artists.filter(
      (artist) =>
        artist.likedTracksCount !== undefined &&
        // いいね曲数が20未満のアーティストは切り捨てる
        artist.likedTracksCount >= 20 &&
        artist.likedTracksCount < 100
    );

    return { availableArtists, groupableArtists };
  }
}
