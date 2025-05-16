import { RecordedTrack } from "./recordedTrack";

export class RecommendationRecord {
  constructor(
    private readonly _id: number,
    private readonly _recommendedAt: string,
    private readonly _tracks: RecordedTrack[]
  ) {}
}
