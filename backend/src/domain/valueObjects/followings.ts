import { ArtistInfo } from "./artistInfo";

export class Followings {
  constructor(private readonly artists: ArtistInfo[]) {}

  // アーティストを いいね曲数 によって分類
  classifyByPublicFavoritesCount() {
    const availableArtists = this.artists.filter(
      (artist) => artist.likedTracksCount >= 100
    );
    const groupableArtists = this.artists.filter(
      (artist) => artist.likedTracksCount >= 20 && artist.likedTracksCount < 100 // いいね曲数が20未満のアーティストは切り捨てる
    );

    return {
      availableArtists: availableArtists,
      groupableArtists: groupableArtists,
    };
  }
}
