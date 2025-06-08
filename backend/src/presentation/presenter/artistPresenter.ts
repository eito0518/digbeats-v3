import { ArtistInfo } from "../../domain/valueObjects/artistInfo";

export class ArtistPresenter {
  static toDTO(artist: ArtistInfo) {
    return {
      soundcloudArtistId: artist.externalUserId,
      name: artist.name,
      avatarUrl: artist.avatarUrl,
      permalinkUrl: artist.permalinkUrl,
      likedTracksCount: artist.likedTracksCount,
      followersCount: artist.followersCount,
    };
  }

  static toDTOList(artists: ArtistInfo[]) {
    return {
      artists: artists.map((artist) => this.toDTO(artist)),
    };
  }
}
