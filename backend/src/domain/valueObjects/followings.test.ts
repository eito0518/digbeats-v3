import { Followings } from "../../domain/valueObjects/followings";
import { ArtistInfo } from "../../domain/valueObjects/artistInfo";
import { RecommendationRequirementsNotMetError } from "../../errors/domain.errors";

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

describe("Followings", () => {
  // レコメンドが生成可能か条件を検証する
  describe("ensureCanGenerateRecommendation", () => {
    it("should not throw an error when condition is met", () => {
      // 条件: 20いいね以上のアーティストが5人以上
      const artists = [
        createMockArtist(40),
        createMockArtist(35),
        createMockArtist(30),
        createMockArtist(25),
        createMockArtist(20),
      ];
      const followings = new Followings(artists);

      expect(() => {
        followings.ensureCanGenerateRecommendation();
      }).not.toThrow();
    });

    it("should throw RecommendationRequirementsNotMetError when there are not enough artists with sufficient track likes", () => {
      // 条件: 20いいね以上のアーティストが4人 (< 5)
      const artists = [
        createMockArtist(40),
        createMockArtist(35),
        createMockArtist(30),
        createMockArtist(25),
        createMockArtist(10), // 条件外のアーティスト
      ];
      const followings = new Followings(artists);

      const action = () => followings.ensureCanGenerateRecommendation();

      const expectedMessage =
        "Insufficient qualified artists. Required: 5, Found: 4";
      expect(action).toThrow(RecommendationRequirementsNotMetError);
      expect(action).toThrow(expectedMessage);
    });
  });

  // アーティストを いいね曲数 によって分類する
  describe("classifyByTrackLikes", () => {
    it("should correctly classify artists based on their track likes", () => {
      // 3つのカテゴリーをすべて含むテストデータを作成
      const artists = [
        createMockArtist(200), // standAloneArtists に入る (>= 100)
        createMockArtist(100), // standAloneArtists に入る (>= 100)
        createMockArtist(99), // groupableArtists に入る (20 <= x < 100)
        createMockArtist(20), // groupableArtists に入るはず (20 <= x < 100)
        createMockArtist(19), // どちらにも入らない (< 20)
        createMockArtist(0), // どちらにも入らない (< 20)
      ];
      const followings = new Followings(artists);

      const { standAloneArtists, groupableArtists } =
        followings.classifyByTrackLikes();

      // externalUserIdを比較して、中身のアーティストの一致をテスト （ソートすることで確実に一致させる)
      const standAloneIds = standAloneArtists
        .map((artist) => artist.externalUserId)
        .sort();
      const expectedStandAloneIds = [
        artists[0].externalUserId,
        artists[1].externalUserId,
      ].sort();
      expect(standAloneIds).toEqual(expectedStandAloneIds);

      const groupableIds = groupableArtists
        .map((artist) => artist.externalUserId)
        .sort();
      const expectedGroupableIds = [
        artists[2].externalUserId,
        artists[3].externalUserId,
      ].sort();
      expect(groupableIds).toEqual(expectedGroupableIds);
    });

    it("should return empty arrays when no artists meet the criteria", () => {
      // すべてのアーティストがいいね20未満のケース
      const artists = [
        createMockArtist(19),
        createMockArtist(15),
        createMockArtist(10),
        createMockArtist(5),
        createMockArtist(0),
      ];
      const followings = new Followings(artists);

      const { standAloneArtists, groupableArtists } =
        followings.classifyByTrackLikes();

      expect(standAloneArtists).toHaveLength(0);
      expect(groupableArtists).toHaveLength(0);
    });
  });
});
