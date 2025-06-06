import { useState } from "react";

export const useTrack = () => {
  const [expandedTrackId, setExpandedTrackId] = useState<number | null>(null); // 展開するのは１つだけ

  // 展開するトラックを切り替える
  const toggleExpandTrack = (trackId: number) => {
    setExpandedTrackId(
      (previous: number | null) =>
        previous === trackId
          ? null // すでに展開されていたら閉じる
          : trackId // 別のtrackを展開したら、そのtrackのIDに切り替える
    );
  };

  return {
    expandedTrackId,
    toggleExpandTrack,
  };
};
