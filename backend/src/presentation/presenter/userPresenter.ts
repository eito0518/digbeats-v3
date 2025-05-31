import { UserInfo } from "../../domain/valueObjects/userInfo";

export class UserPresenter {
  static toDTO(user: UserInfo) {
    return {
      user: {
        name: user.name,
        avatarUrl: user.avatarUrl,
        permalinkUrl: user.permalinkUrl,
      },
    };
  }
}
