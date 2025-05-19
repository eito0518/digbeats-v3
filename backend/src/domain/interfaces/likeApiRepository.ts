export interface LikeApiRepository {
  likeTrack(accessToken: string, externalTrackId: number): Promise<void>;
}
