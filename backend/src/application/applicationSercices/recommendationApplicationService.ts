import { TrackApiRepository } from "../../domain/interfaces/trackApiRepository";
import { SourceArtist } from "../../domain/models/sourceArtist";
import { TrackInfo } from "../../domain/valueObjects/trackInfo";

export class RecommendationApplicationService {
  constructor(private readonly _trackApiRepository: TrackApiRepository) {}

  async fetchAndPickLikedTracks(
    accessToken: string,
    sourceArtist: SourceArtist,
    limit: number // レコメンドとして返す曲数
  ): Promise<TrackInfo[]> {
    // アーティスト1人あたりの最大取得ページ数
    // - 通常アーティスト: 最大6ページ（最大300曲）
    // - 仮想アーティスト: 1ページのみ（最大50曲 × 最大5人 = 250曲程度）
    const maxPageCount = sourceArtist.isVirtual() ? 1 : 6;

    const fetchTargets = sourceArtist.getFetchTargets();

    const results = await Promise.all(
      fetchTargets.map((artist) =>
        this._trackApiRepository.fetchLikedTracks(
          accessToken,
          artist.externalUserId,
          maxPageCount
        )
      )
    );

    // TrackInfo[][] から TrackInfo[] に変換
    const allTracks = results.flat();

    // 指定された数だけランダムに選択
    return this.pickRandomN(allTracks, limit);
  }

  // 配列から指定された数の要素をランダムに返す関数
  private pickRandomN<T>(array: T[], limit: number): T[] {
    // Fisher–Yatesアルゴリズムでシャッフル
    const newArray = [...array]; // 元の配列は壊さずコピー
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 0~i のランダムな整数
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 要素を入れ替える
    }
    // シャッフル後の先頭から limit 個を取り出す
    return newArray.slice(0, limit);
  }
}
