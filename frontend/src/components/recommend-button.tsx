"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

type RecommendButtonProps = {
  initialCount: number;
};

export function RecommendButton({ initialCount }: RecommendButtonProps) {
  const [recommended, setRecommended] = useState(false);

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition ${
        recommended
          ? "border-teal-600 bg-teal-50 text-teal-700"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-teal-500"
      }`}
      onClick={() => setRecommended((value) => !value)}
      type="button"
    >
      <ThumbsUp size={16} aria-hidden="true" />
      추천 {initialCount + (recommended ? 1 : 0)}
    </button>
  );
}
