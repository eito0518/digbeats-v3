import {
  shuffleArray,
  chunkArray,
  virtualSourceArtistFactory,
} from "./virtualSourceArtistFactory";
import { ArtistInfo } from "../valueObjects/artistInfo";
import { InvalidDomainDataError } from "../../errors/domain.errors";

function createMockArtist(likedTracksCount: number): ArtistInfo {
  return new ArtistInfo(
    Math.floor(Math.random() * 100),
    "mock_artist_name",
    "https://mock.com/avatar.jpg",
    "https://mock.com/permalink",
    likedTracksCount,
    100
  );
}

// 配列をシャッフルする
describe("shuffleArray", () => {
  it("should contain the same elements as the original array", () => {
    const originalArray = [1, 2, 3, 4, 5];
    const shuffledArray = shuffleArray(originalArray);

    // 要素の数が変わらないことをテスト
    expect(shuffledArray).toHaveLength(originalArray.length);
    // 要素の中身が変わらないことをテスト
    expect(shuffledArray.sort()).toEqual(originalArray.sort());
  });

  it("should return a new array instance", () => {
    const originalArray = [1, 2, 3];
    const shuffledArray = shuffleArray(originalArray);
    // 元の配列を変更していない(別のインスタンスである)ことをテスト
    expect(shuffledArray).not.toBe(originalArray);
  });
});

// 配列を分割する
describe("chunkArray", () => {
  it("should divide an array into chunks of the specified size", () => {
    const array = [1, 2, 3, 4, 5, 6];
    expect(chunkArray(array, 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("should handle arrays where the length is not a multiple of the chunk size", () => {
    const array = [1, 2, 3, 4, 5];
    expect(chunkArray(array, 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("should return an empty array when given an empty array", () => {
    const array: any[] = [];
    expect(chunkArray(array, 2)).toEqual([]);
  });
});

// 仮想ソースアーティストを生成する
describe("virtualSourceArtistFactory", () => {
  describe("create", () => {
    it("should create VirtualSourceArtists only from groups with total track likes >= 100", () => {
      const artists = [
        // いいね数が20曲のアーティスト13人
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
        createMockArtist(20),
      ];

      const virtualSourceArtists = virtualSourceArtistFactory.create(artists);

      // 期待通りに2つの仮想アーティストが生成されることをテスト
      // グループは [5人, 5人, 3人] に分割される
      // 合計いいねは [100, 100, 60] となり、最後のグループは除外されるはず
      expect(virtualSourceArtists).toHaveLength(2);

      // 生成された各仮想アーティストの合計いいね数が100以上であることをテスト
      virtualSourceArtists.forEach((virtualArtist) => {
        const componentArtists = virtualArtist.getComponentArtists();
        const totalTrackLikes = componentArtists.reduce(
          (sum, artist) => sum + (artist.likedTracksCount || 0),
          0
        );
        expect(totalTrackLikes).toBeGreaterThanOrEqual(100);
      });
    });

    it("should create a virtualSourceArtists from a group of less than 5 if total likes are sufficient", () => {
      // いいね数が99曲のアーティスト8人
      const artists = [
        createMockArtist(99),
        createMockArtist(99),
        createMockArtist(99),
        createMockArtist(99),
        createMockArtist(99),
        createMockArtist(99),
        createMockArtist(99),
      ];

      const virtualSourceArtists = virtualSourceArtistFactory.create(artists);

      // 期待通りに2つの仮想アーティストが生成されることをテスト
      // グループは [5人, 3人] に分割される
      // 合計いいねは [495, 189] となり、最後のグループは５人未満だが合計いいね数が１００以上
      expect(virtualSourceArtists).toHaveLength(2);

      // 生成された各仮想アーティストの合計いいね数が100以上であることをテスト
      virtualSourceArtists.forEach((virtualArtist) => {
        const componentArtists = virtualArtist.getComponentArtists();
        const totalTrackLikes = componentArtists.reduce(
          (sum, artist) => sum + (artist.likedTracksCount || 0),
          0
        );
        expect(totalTrackLikes).toBeGreaterThanOrEqual(100);
      });
    });

    it("should return an empty array when no groups meet the criteria", () => {
      // いいね数が20曲未満のアーティスト8人
      const artists = [
        createMockArtist(10),
        createMockArtist(10),
        createMockArtist(10),
        createMockArtist(10),
        createMockArtist(10),
        createMockArtist(10),
        createMockArtist(10),
      ];

      expect(virtualSourceArtistFactory.create(artists)).toHaveLength(0);
    });

    it("should return an empty array when the input array is empty", () => {
      const artists: ArtistInfo[] = [];

      expect(virtualSourceArtistFactory.create(artists)).toHaveLength(0);
    });

    it("should throw an error if an artist has an undefined likedTracksCount", () => {
      const artists = [
        createMockArtist(50),
        createMockArtist(50),
        createMockArtist(50),
        createMockArtist(50),
        createMockArtist(undefined as any), // likedTracksCountがundefinedの不正なデータ
      ];

      expect(() => virtualSourceArtistFactory.create(artists)).toThrow(
        InvalidDomainDataError
      );
    });
  });
});
