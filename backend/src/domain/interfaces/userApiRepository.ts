export interface GetUserResponse {
  name: string;
  soundCloudUserId: string;
  avatarUrl: string;
  publicFavoritesCount: number;
  followingsCount: number;
}

export interface UserApiRepository {
  getUser(accessToken: string): Promise<GetUserResponse>;
}
