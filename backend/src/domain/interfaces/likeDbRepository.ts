export interface LikeDbRepository {
  save(recommendationId: number, trackId: number): Promise<void>;
}
