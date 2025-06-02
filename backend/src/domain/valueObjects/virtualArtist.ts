import { SourceArtist } from "../models/sourceArtist";
import { ArtistInfo } from "./artistInfo";

export class VirtualArtist implements SourceArtist {
  constructor(private readonly _artists: ArtistInfo[]) {}

  isVirtual(): boolean {
    return true;
  }

  getFetchTargets(): ArtistInfo[] {
    return this._artists; // そのまま構成アーティストの配列である　ArtistInfo[]　を返す
  }
}
