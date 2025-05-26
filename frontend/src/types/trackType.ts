export type Track = {
  id: number;
  title: string;
  artworkUrl: string;
  permalinkUrl: string;
  artist: {
    name: string;
    avatarUrl: string;
    permalinkUrl: string;
  };
  wasLiked: boolean;
};
