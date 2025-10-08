// ドメイン層のエラーであることを示す基底クラス
export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name; // クラス名をエラー名として設定
  }
}

// レコメンド生成の要件を満たしていない場合にスローされるエラー
export class RecommendationRequirementsNotMetError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

// ドメインのエンティティやValueIbjectのデータが不正な場合にスローされるエラー
export class InvalidDomainDataError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
