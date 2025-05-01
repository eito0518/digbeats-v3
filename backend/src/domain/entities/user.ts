import { UserInfo } from "../valueObjects/userInfo";

export class User {
  constructor(
    private readonly _userId: number,
    private readonly _userInfo: UserInfo
  ) {}
}
