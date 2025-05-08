import { SourceArtist } from "../models/sourceArtist";
import { ArtistInfo } from "./artistInfo";

export class RegularArtist implements SourceArtist {
  constructor(private readonly artist: ArtistInfo) {}

  isVirtual(): boolean {
    return false;
  }
}
