import { Track } from "../../domain/entities/track";

export class TrackPresenter {
  static toDTO(track: Track) {
    return {
      id: track.id,
      title: track.title,
      artworkUrl: track.artworkUrl,
      permalinkUrl: track.permalinkUrl,
      isLiked: track.isLiked,
      artist: {
        name: track.artist.name,
        avatarUrl: track.artist.avatarUrl,
        permalinkUrl: track.artist.permalinkUrl,
      },
    };
  }
}
