import { Request, Response } from "express";
import { SearchArtistsUseCase } from "../../application/usecase/searchArtistsUseCase";
import { validateArtistNameParam } from "../utils/validation";
import { ArtistPresenter } from "../presenter/artistPresenter";

export class ArtistController {
  constructor(private readonly _searchArtistsUseCase: SearchArtistsUseCase) {}

  // アーティストを検索する
  searchArtists = async (req: Request, res: Response): Promise<void> => {
    // リクエスト
    const sessionId = req.cookies.sessionId;
    const artistNameRaw = req.query.artistName;

    // バリデーション
    const artistName = validateArtistNameParam(artistNameRaw);

    // ユースケース
    const artists = await this._searchArtistsUseCase.run(sessionId, artistName);

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        domain: ".digbeats.jp",
        sameSite: "lax",
      })
      .status(200)
      .json(ArtistPresenter.toDTOList(artists));
  };
}
