import { Track } from "./track";

export class Recommendation {
  constructor(
    private readonly _userId: number,
    private readonly _tracks: Track[],
    private readonly _id?: number, // DB保存時に付与
    private readonly _createdAt?: string // DB保存時に付与
  ) {}

  get userId() {
    return this._userId;
  }

  get tracks() {
    return this._tracks;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  // レコメンドIDを付与して、IDが付与されたトラックに差し替え
  withPersistenceInfo(
    id: number,
    tracksWithId: Track[],
    createdAt: string
  ): Recommendation {
    return new Recommendation(
      this.userId,
      tracksWithId, // IDが付与されたトラックに差し替え
      id,
      createdAt
    );
  }
}
