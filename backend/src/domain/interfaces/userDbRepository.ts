export interface FindUserByExternalIdResponse {
  userId: number;
}

export interface CreateUserResponse {
  userId: number;
}

export interface UserDbRepository {
  findUserByExternalId(
    externalUserId: string
  ): Promise<FindUserByExternalIdResponse | undefined>;

  createUser(externalUserId: string): Promise<CreateUserResponse>;
}
