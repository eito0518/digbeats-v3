import { ArtistInfo } from "../valueObjects/artistInfo";
import { VirtualArtist } from "../valueObjects/virtualArtist";

export class VirtualArtistFactory {
  // 仮想アーティストを生成する
  static create(groupableArtists: ArtistInfo[]): VirtualArtist[] {
    // アーティストをランダムに並び替え
    const shuffledArtists = shuffleArray(groupableArtists);

    // 最大５人ずつでグループ化
    const artistsGroups = chunkArray(shuffledArtists, 5);

    // 「合計いいね曲数」が100曲以上のグループを判定
    const validGroups = artistsGroups.filter((group) => {
      const groupTotalFavorits = group.reduce((sum, artist) => {
        if (artist.likedTracksCount === undefined) {
          const message = `likedTracksCount is missing for artist: ${JSON.stringify(
            artist
          )}`;
          console.error(`[virtualArtistFactory] ${message}`);
          throw new Error(message);
        }
        return sum + artist.likedTracksCount;
      }, 0); // sumの初期値

      return groupTotalFavorits >= 100;
    });

    // 条件を満たすグループを　VO(仮想アーティスト型)　に変換して返す
    return validGroups.map((group) => new VirtualArtist(group));
  }
}

// 配列をシャッフルする関数
function shuffleArray<T>(array: T[]): T[] {
  // Fisher–Yatesアルゴリズム
  // 1. 最後の位置から順に「その位置に入る要素」をランダムに選び入れ替える
  // 2. 確定した位置は再度入れ替え対象にならない
  // 3. 最終的に全順列（n!通り）の中から1つを等確率で得る
  const newArray = [...array]; // 元の配列は壊さずコピー
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0~i のランダムな整数
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 要素を入れ替える
  }
  return newArray;
}

// 配列を分割する関数
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize)); // slice は範囲外でも配列末尾まで安全に切り出される
  }
  return result;
}
