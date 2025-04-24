export interface FindUserBySoundCloudUserIdResponse {
  userId: number;
}

export interface UserDbRepository {
  findUserBySoundCloudUserId(
    soundCloudUserId: string
  ): Promise<FindUserBySoundCloudUserIdResponse>;
}
