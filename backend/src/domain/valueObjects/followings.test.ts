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

      const expectedMessage =
        "Insufficient qualified artists. Required: 5, Found: 4";
      const action = () => followings.ensureCanGenerateRecommendation();

      expect(action).toThrow(RecommendationRequirementsNotMetError);
      expect(action).toThrow(expectedMessage);
    });
  });

  // アーティストを いいね曲数 によって分類する
  describe("", () => {});
});
