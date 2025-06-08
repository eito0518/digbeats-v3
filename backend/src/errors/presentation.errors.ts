// プレゼンテーション層のエラーであることを示す基底クラス
export abstract class PresentationError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name; // クラス名をエラー名として設定
  }
}

// クライアントのリクエストが不正な場合にスローされるエラー
export class BadRequestError extends PresentationError {
  constructor(message: string) {
    super(message);
  }
}
