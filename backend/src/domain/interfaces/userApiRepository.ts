import { UserInfo } from "../valueObjects/userInfo";
import { ArtistInfo } from "../valueObjects/artistInfo";

export interface UserApiRepository {
  fetchUser(accessToken: string): Promise<UserInfo>;
  fetchFollowings(accessToken: string): Promise<Array<ArtistInfo>>;
}
