export type Track = {
  id: number;
  title: string;
  artworkUrl: string;
  permalinkUrl: string;
  isLiked: boolean;
  artist: {
    name: string;
    avatarUrl: string;
    permalinkUrl: string;
  };
};
