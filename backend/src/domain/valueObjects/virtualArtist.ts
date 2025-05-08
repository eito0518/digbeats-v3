import { SourceArtist } from "../models/sourceArtist";
import { ArtistInfo } from "./artistInfo";

export class VirtualArtist implements SourceArtist {
  constructor(private readonly artist: ArtistInfo[]) {}

  isVirtual(): boolean {
    return true;
  }
}
