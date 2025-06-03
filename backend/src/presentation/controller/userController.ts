import { Request, Response } from "express";
import { FetchMyUserInfoUseCase } from "../../application/usecase/fetchMyUserInfoUseCase";
import { FetchMyFollowingsUseCase } from "../../application/usecase/fetchMyFollowingsUseCase";
import { FollowArtistUseCase } from "../../application/usecase/followArtistUseCase";
import { UnfollowArtistUseCase } from "../../application/usecase/unfollowArtistUseCase";
import { FetchLikedSoundCloudTrackIdsUseCase } from "../../application/usecase/fetchLikedSoundCloudTrackIdsUseCase";
import { LikeTrackUseCase } from "../../application/usecase/likeTrackUseCase";
import {
  validateSessionId,
  validateSoundCloudArtistId,
  validateLikeParams,
} from "../utils/validation";
import { UserPresenter } from "../presenter/userPresenter";
import { ArtistPresenter } from "../presenter/artistPresenter";

export class UserController {
  constructor(
    private readonly _fetchMyUserInfoUseCase: FetchMyUserInfoUseCase,
    private readonly _fetchMyFollowingsUseCase: FetchMyFollowingsUseCase,
    private readonly _followArtistUseCase: FollowArtistUseCase,
    private readonly _unfollowArtistUseCase: UnfollowArtistUseCase,
    private readonly _fetchLikedSoundCloudTrackIdsUseCase: FetchLikedSoundCloudTrackIdsUseCase,
    private readonly _likeTrackUseCase: LikeTrackUseCase
  ) {}

  // 自分のユーザー情報を取得する
  async fetchMyUserInfo(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // バリデーション
    if (!validateSessionId(sessionId, res)) return;

    // ユースケース
    const user = await this._fetchMyUserInfoUseCase.run(sessionId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json(UserPresenter.toDTO(user));
  }

  // フォロー中のアーティストを取得する
  async fetchMyFollowings(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // バリデーション
    if (!validateSessionId(sessionId, res)) return;

    // ユースケース
    const followings = await this._fetchMyFollowingsUseCase.run(sessionId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({ artists: ArtistPresenter.toDTOList(followings) });
  }

  // アーティストをフォローする
  async followArtist(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;
    const soundcloudArtistIdRaw = req.body.soundcloudArtistId;

    // バリデーション
    if (!validateSessionId(sessionId, res)) return;

    const soundcloudArtistId = validateSoundCloudArtistId(
      soundcloudArtistIdRaw,
      res
    );
    if (soundcloudArtistId === undefined) return;

    // ユースケース
    await this._followArtistUseCase.run(sessionId, soundcloudArtistId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({ message: "Followed artist successfully" });
  }

  // アーティストをフォロー解除する
  async unfollowArtist(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;
    const soundcloudArtistIdRaw = req.body.soundcloudArtistId;

    // バリデーション
    if (!validateSessionId(sessionId, res)) return;

    const soundcloudArtistId = validateSoundCloudArtistId(
      soundcloudArtistIdRaw,
      res
    );
    if (soundcloudArtistId === undefined) return;

    // ユースケース
    await this._unfollowArtistUseCase.run(sessionId, soundcloudArtistId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({ message: "unfollowed artist successfully" });
  }

  // いいね中の SoundCloudTrackId を取得する
  async fetchLikedSoundCloudTrackIds(
    req: Request,
    res: Response
  ): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // バリデーション
    if (!validateSessionId(sessionId, res)) return;

    // ユースケース
    const likedSoundCloudTrackIds =
      await this._fetchLikedSoundCloudTrackIdsUseCase.run(sessionId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({ soundcloudTrackIds: likedSoundCloudTrackIds });
  }

  // 楽曲のいいねを登録する
  async likeTrack(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    const { recommendationIdRaw, trackIdRaw } = req.body;

    // バリデーション
    if (!validateSessionId(sessionId, res)) return;

    const validatedLikeParams = validateLikeParams(
      recommendationIdRaw,
      trackIdRaw,
      res
    );
    if (!validatedLikeParams) return;

    const { recommendationId, trackId } = validatedLikeParams;

    // ユースケース
    await this._likeTrackUseCase.run(sessionId, recommendationId, trackId);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({ message: "liked track successfully" });
  }
}
