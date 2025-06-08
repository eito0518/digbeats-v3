import { UserInfo } from "../valueObjects/userInfo";
import { ArtistInfo } from "../valueObjects/artistInfo";

export interface UserApiRepository {
  fetchMyUserInfo(accessToken: string): Promise<UserInfo>;
  fetchFollowings(accessToken: string): Promise<Array<ArtistInfo>>;
  followArtist(accessToken: string, soundcloudArtistId: number): Promise<void>;
  unfollowArtist(
    accessToken: string,
    soundcloudArtistId: number
  ): Promise<void>;
  likeTrack(accessToken: string, soundcloudTrackId: number): Promise<void>;
  unlikeTrack(accessToken: string, soundcloudTrackId: number): Promise<void>;
}
