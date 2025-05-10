import { SourceArtist } from "../models/sourceArtist";
import { ArtistInfo } from "./artistInfo";

export class RegularArtist implements SourceArtist {
  constructor(private readonly _artist: ArtistInfo) {}

  isVirtual(): boolean {
    return false;
  }

  getFetchTargets(): ArtistInfo[] {
    return [this._artist]; // 1人のアーティストを配列にして返す
  }
}
