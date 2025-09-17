import { validateAuthParams, validateSessionId } from "./validation";
import { ReauthenticationRequiredError } from "../../errors/application.errors";
import { BadRequestError } from "../../errors/presentation.errors";

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
