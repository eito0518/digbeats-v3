import { SourceArtist } from "../models/sourceArtist";
import { ArtistInfo } from "./artistInfo";

export class StandAloneSourceArtist implements SourceArtist {
  constructor(private readonly _artist: ArtistInfo) {}

  isVirtual(): boolean {
    return false;
  }

  getComponentArtists(): ArtistInfo[] {
    return [this._artist]; // ArtistInfo[] に変換
  }
}
