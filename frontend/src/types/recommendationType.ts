import { Track } from "./trackType";

export type Recommendation = {
  recommendationId: number;
  recommendedAt: string;
  tracks: Track[];
};
