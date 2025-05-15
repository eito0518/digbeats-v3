import { TrackInfo } from "../valueObjects/trackInfo";

export class Recommendation {
  constructor(
    private readonly _userId: number,
    private readonly _tracks: TrackInfo[],
    private readonly _id?: number // DB保存時に付与
  ) {}

  get userId() {
    return this._userId;
  }

  get tracks() {
    return this._tracks;
  }
}
