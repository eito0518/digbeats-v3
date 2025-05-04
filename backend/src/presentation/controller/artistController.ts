import { SearchArtistsUseCase } from "../../application/usecase/searchArtistsUseCase";
import { Request, Response } from "express";

export class ArtistController {
  constructor(private readonly _searchArtistsUseCase: SearchArtistsUseCase) {}

  async searchArtists(req: Request, res: Response): Promise<void> {
    // リクエスト
    const sessionId = req.cookies.sessionId;
    const artistNameRaw = req.query.artistName;

    if (typeof artistNameRaw !== "string") {
      res.status(400).json({ error: "Missing 'artistName' query parameter" });
      return;
    }

    const decodedArtistName = decodeURIComponent(artistNameRaw);

    // ユースケース
    const artists = await this._searchArtistsUseCase.run(
      sessionId,
      decodedArtistName
    );

    // レスポンス
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // TODO：　時間があればCSRF対策　で　csurfを導入する
      })
      .status(200)
      .json({
        artists: artists,
      });
  }
}
