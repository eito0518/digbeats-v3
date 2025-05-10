import { SourceArtist } from "../models/sourceArtist";
import { ArtistInfo } from "./artistInfo";

export class VirtualArtist implements SourceArtist {
  constructor(private readonly _artists: ArtistInfo[]) {}

  isVirtual(): boolean {
    return true;
  }

  getFetchTargets(): ArtistInfo[] {
    return this._artists; // 複数の構成アーティストをそのまま配列で返す
  }
}
