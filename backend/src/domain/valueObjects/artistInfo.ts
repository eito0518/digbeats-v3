export class ArtistInfo {
  constructor(
    private readonly _externalUserId: number,
    private readonly _name: string,
    private readonly _avatarUrl: string,
    private readonly _publicFavoritesCount: number,
    private readonly _permalinkUrl: string
  ) {}
}
