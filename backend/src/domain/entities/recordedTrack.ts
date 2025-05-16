export class RecordedTrack {
  constructor(
    private readonly _id: number,
    private readonly _permalinkUrl: string,
    private readonly _wasLiked: boolean
  ) {}
}
