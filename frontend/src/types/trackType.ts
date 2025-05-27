export type Track = {
  id: number;
  title: string;
  artworkUrl: string;
  permalinkUrl: string;
  wasLiked: boolean;
  artist: {
    name: string;
    avatarUrl: string;
    permalinkUrl: string;
  };
};
