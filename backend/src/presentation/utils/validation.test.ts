import {
  validateAuthParams,
  validateSessionId,
  validateArtistNameParam,
  validateSoundCloudArtistId,
} from "./validation";
import { ReauthenticationRequiredError } from "../../errors/application.errors";
import { BadRequestError } from "../../errors/presentation.errors";

// 認証情報 （code, codeVerifier） の存在チェック
describe("validateAuthParams", () => {
  it("should not throw an error when both code and codeVerifier are valid", () => {
    expect(() => {
      validateAuthParams("ABCDEFG123456", "HIJKLMN78910");
    }).not.toThrow();
  });

  it("should throw ReauthenticationRequiredError when the code parameter is an empty string", () => {
    expect(() => {
      validateAuthParams("", "HIJKLMN78910");
    }).toThrow(ReauthenticationRequiredError);
  });

  it("should throw ReauthenticationRequiredError when the codeVerifier parameter is an empty string", () => {
    expect(() => {
      validateAuthParams("ABCDEFG123456", "");
    }).toThrow(ReauthenticationRequiredError);
  });

  it("should throw ReauthenticationRequiredError when the code parameter is null", () => {
    expect(() => {
      validateAuthParams(null as any, "valid_verifier");
    }).toThrow(ReauthenticationRequiredError);
  });

  it("should throw ReauthenticationRequiredError when the codeVerifier parameter is undefined", () => {
    expect(() => {
      validateAuthParams("valid_code", undefined as any);
    }).toThrow(ReauthenticationRequiredError);
  });
});

// sessionId の存在チェック
describe("validateSessionId", () => {
  it("should not throw an error when sessionId is valid", () => {
    expect(() => {
      validateSessionId("ABCDEFG123456");
    }).not.toThrow();
  });

  it("should throw ReauthenticationRequiredError when sessionId is an empty string", () => {
    expect(() => {
      validateSessionId("");
    }).toThrow(ReauthenticationRequiredError);
  });

  it("should throw ReauthenticationRequiredError when sessionId is null", () => {
    expect(() => {
      validateSessionId(null as any);
    }).toThrow(ReauthenticationRequiredError);
  });

  it("should throw ReauthenticationRequiredError when sessionId is undefined", () => {
    expect(() => {
      validateSessionId(undefined as any);
    }).toThrow(ReauthenticationRequiredError);
  });
});

// artistName クエリパラメータの存在チェック と 文字変換
describe("validateArtistNameParam", () => {
  it("should return a decoded string when given a valid URI-encoded string", () => {
    const encodedArtistName = "%E3%81%82%E3%81%84%E3%81%BF%E3%82%87%E3%82%93";
    const expectedDecodedName = "あいみょん";
    expect(validateArtistNameParam(encodedArtistName)).toBe(
      expectedDecodedName
    );
  });

  it("should throw BadRequestError when the input is not a string", () => {
    expect(() => {
      validateArtistNameParam(123 as any);
    }).toThrow(BadRequestError);
    expect(() => {
      validateArtistNameParam(null as any);
    }).toThrow(BadRequestError);
    expect(() => {
      validateArtistNameParam(undefined as any);
    }).toThrow(BadRequestError);
  });

  it("should throw BadRequestError when the input is an empty string", () => {
    expect(() => {
      validateArtistNameParam("");
    }).toThrow(BadRequestError);
  });

  it("should throw BadRequestError when the input string contains only whitespace", () => {
    expect(() => {
      validateArtistNameParam("   ");
    }).toThrow(BadRequestError);
  });
});

// soundcloudArtistId の存在チェック と 数値変換
describe("validateSoundCloudArtistId", () => {
  it("should return a number when given a valid positive integer string", () => {
    expect(validateSoundCloudArtistId("12345")).toBe(12345);
  });

  it("should throw BadRequestError when the input is null", () => {
    expect(() => {
      validateSoundCloudArtistId(null as any);
    }).toThrow("Missing 'soundcloudArtistId'");
  });

  it("should throw BadRequestError when the input is undefined", () => {
    expect(() => {
      validateSoundCloudArtistId(undefined as any);
    }).toThrow("Missing 'soundcloudArtistId'");
  });

  it("should throw BadRequestError when the input is a non-numeric string", () => {
    expect(() => {
      validateSoundCloudArtistId("abc" as any);
    }).toThrow("'soundcloudArtistId' must be a positive integer");
  });

  it("should throw BadRequestError when the input is a float string", () => {
    expect(() => {
      validateSoundCloudArtistId("123.45" as any);
    }).toThrow("'soundcloudArtistId' must be a positive integer");
  });

  it("should throw BadRequestError when the input is zero", () => {
    expect(() => {
      validateSoundCloudArtistId("0" as any);
    }).toThrow("'soundcloudArtistId' must be a positive integer");
  });

  it("should throw BadRequestError when the input is a negative integer string", () => {
    expect(() => {
      validateSoundCloudArtistId("-123" as any);
    }).toThrow("'soundcloudArtistId' must be a positive integer");
  });
});
