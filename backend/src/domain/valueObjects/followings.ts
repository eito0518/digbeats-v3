import { ArtistInfo } from "./artistInfo";
import { RecommendationRequirementsNotMetError } from "../../errors/domain.errors";

export class Followings {
  constructor(private readonly _artists: ArtistInfo[]) {}

  // レコメンドが生成可能か条件を検証する
  public ensureCanGenerateRecommendation(): void {
    // 条件: いいね数が20以上のフォロー中アーティストが、5人以上いるかどうか
    const artistsWithSufficientTrackLikes = this._artists.filter(
      (artist) =>
        artist.likedTracksCount !== undefined && artist.likedTracksCount >= 20
    );

    if (artistsWithSufficientTrackLikes.length < 5) {
      const message = `Insufficient qualified artists. Required: 5, Found: ${artistsWithSufficientTrackLikes.length}`;
      throw new RecommendationRequirementsNotMetError(message);
    }
  }

  // アーティストを いいね曲数 によって分類する
  public classifyByTrackLikes() {
    const standAloneArtists = this._artists.filter(
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

    return { standAloneArtists, groupableArtists };
  }
}
