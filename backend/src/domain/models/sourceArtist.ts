import { ArtistInfo } from "../valueObjects/artistInfo";

export interface SourceArtist {
  isVirtual(): boolean;
  getFetchTargets(): ArtistInfo[];
}
