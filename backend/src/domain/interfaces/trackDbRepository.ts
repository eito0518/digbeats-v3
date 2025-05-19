export interface TrackDbRepository {
  getExternalTrackId(trackId: number): Promise<number>;
}
