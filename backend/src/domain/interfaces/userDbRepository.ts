export interface UserDbRepository {
  findUserIdByExternalId(externalUserId: number): Promise<number | undefined>;
  createUser(externalUserId: number): Promise<number>;
}
