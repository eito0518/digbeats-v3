// アプリケーション層のエラーであることを示す基底クラス
export abstract class ApplicationError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name; // クラス名をエラー名として設定
  }
}

// 再認証が必要な場合にスローされるエラー
export class ReauthenticationRequiredError extends ApplicationError {
  constructor(message: string = "Reauthentication is required.") {
    super(message);
  }
}
