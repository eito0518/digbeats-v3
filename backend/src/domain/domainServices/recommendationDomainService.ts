import { Followings } from "../valueObjects/followings";
import { SourceArtist } from "../models/sourceArtist";
import { RegularArtist } from "../valueObjects/regularArtist";
import { VirtualArtistFactory } from "../factories/virtualArtistFactory";

export class RecommendationDomainService {
  constructor() {}

  // レコメンドのソースとなるアーティストをランダムに選ぶ
  pickSourceArtist(followings: Followings): SourceArtist {
    // アーティストを いいね曲数 によって分類
    const { availableArtists, groupableArtists } =
      followings.classifyByPublicFavoritesCount();

    // いいね楽曲の数が十分なアーティストは VO（通常アーティスト型） に変換
    const regularArtists = availableArtists.map(
      (artist) => new RegularArtist(artist)
    );

    // 条件に応じて複数のアーティストをまとめて 仮想アーティスト を作成
    const virtualArtists = VirtualArtistFactory.create(groupableArtists);

    // レコメンドのソースとなるアーティストをランダムに1人選んで返す
    const candidates: SourceArtist[] = [...regularArtists, ...virtualArtists];

    const randomIndex = Math.floor(Math.random() * candidates.length); // インデックスをランダムに決定

    return candidates[randomIndex];
  }
}
