import { ArtistInfo } from "./artistInfo";

export class Followings {
  constructor(private readonly _artists: ArtistInfo[]) {}

  // アーティストを いいね曲数 によって分類
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
