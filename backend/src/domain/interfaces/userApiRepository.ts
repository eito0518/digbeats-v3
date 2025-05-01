import { UserInfo } from "../valueObjects/userInfo";

export interface UserApiRepository {
  fetchUser(accessToken: string): Promise<UserInfo>;
}
