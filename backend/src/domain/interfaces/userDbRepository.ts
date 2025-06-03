export interface UserDbRepository {
  findUserIdByExternalId(externalUserId: number): Promise<number | undefined>;
  createUser(externalUserId: number): Promise<number>;
  likeTrack(recommendationId: number, trackId: number): Promise<void>;
  unlikeTrack(recommendationId: number, trackId: number): Promise<void>;
}
