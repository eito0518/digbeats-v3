import { Request, Response } from "express";
import { FetchMyUserInfoUseCase } from "../../application/usecase/fetchMyUserInfoUseCase";
import { FetchMyFollowingsUseCase } from "../../application/usecase/fetchMyFollowingsUseCase";
import { FollowArtistUseCase } from "../../application/usecase/followArtistUseCase";
import { UnfollowArtistUseCase } from "../../application/usecase/unfollowArtistUseCase";
import { LikeTrackUseCase } from "../../application/usecase/likeTrackUseCase";
import { UnlikeTrackUseCase } from "../../application/usecase/unlikeTrackUseCase";
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
    private readonly _likeTrackUseCase: LikeTrackUseCase,
    private readonly _unlikeTrackUseCase: UnlikeTrackUseCase
  ) {}

  // 自分のユーザー情報を取得する
  fetchMyUserInfo = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // バリデーション
    validateSessionId(sessionId);

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
  };

  // フォロー中のアーティストを取得する
  fetchMyFollowings = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    // バリデーション
    validateSessionId(sessionId);

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
      .json(ArtistPresenter.toDTOList(followings));
  };

  // アーティストをフォローする
  followArtist = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;
    const soundcloudArtistIdRaw = req.body.soundcloudArtistId;

    // バリデーション
    validateSessionId(sessionId);

    const soundcloudArtistId = validateSoundCloudArtistId(
      soundcloudArtistIdRaw
    );

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
  };

  // アーティストをフォロー解除する
  unfollowArtist = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;
    const soundcloudArtistIdRaw = req.body.soundcloudArtistId;

    // バリデーション
    validateSessionId(sessionId);

    const soundcloudArtistId = validateSoundCloudArtistId(
      soundcloudArtistIdRaw
    );

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
  };

  // 楽曲のいいねを登録する
  likeTrack = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    const { recommendationId, trackId } = req.body;

    // バリデーション
    validateSessionId(sessionId);

    const validatedLikeParams = validateLikeParams(recommendationId, trackId);

    // ユースケース
    await this._likeTrackUseCase.run(
      sessionId,
      validatedLikeParams.recommendationId,
      validatedLikeParams.trackId
    );

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({ message: "liked track successfully" });
  };

  // 楽曲のいいねを解除する
  unlikeTrack = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;

    const { recommendationId, trackId } = req.body;

    // バリデーション
    validateSessionId(sessionId);

    const validatedLikeParams = validateLikeParams(recommendationId, trackId);

    // ユースケース
    await this._unlikeTrackUseCase.run(
      sessionId,
      validatedLikeParams.recommendationId,
      validatedLikeParams.trackId
    );

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({ message: "unliked track successfully" });
  };
}
