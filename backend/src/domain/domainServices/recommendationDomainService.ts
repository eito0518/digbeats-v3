import { Followings } from "../valueObjects/followings";
import { SourceArtist } from "../models/sourceArtist";
import { StandAloneSourceArtist } from "../valueObjects/standAloneSourceArtist";
import { virtualSourceArtistFactory } from "../factories/virtualSourceArtistFactory";

export class RecommendationDomainService {
  constructor() {}

  // レコメンドのソースとなるアーティストをランダムに選ぶ
  pickSourceArtist(followings: Followings): SourceArtist {
    // アーティストを いいね曲数 によって分類
    const { standAloneArtists, groupableArtists } =
      followings.classifyByTrackLikes();

    // いいね楽曲の数が十分なアーティストは VO（単独ソースアーティスト型） に変換
    const standAloneSourceArtists = standAloneArtists.map(
      (artist) => new StandAloneSourceArtist(artist)
    );

    // 条件に応じて複数のアーティストをまとめて 仮想ソースアーティスト を作成
    const virtualSourceArtists =
      virtualSourceArtistFactory.create(groupableArtists);

    // レコメンドのソースとなるアーティストをランダムに1人選んで返す
    const candidates: SourceArtist[] = [
      ...standAloneSourceArtists,
      ...virtualSourceArtists,
    ];
    const randomIndex = Math.floor(Math.random() * candidates.length); // インデックスをランダムに決定
    return candidates[randomIndex];
  }
}
