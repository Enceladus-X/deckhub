"use client";

import { useMemo, useState } from "react";
import { Share2 } from "lucide-react";

type ShareButtonProps = {
  slug: string;
};

export function ShareButton({ slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const sharePath = useMemo(() => `/decks/${slug}/`, [slug]);

  async function copyShareUrl() {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://deckhub";
    const shareUrl = `${origin}${sharePath}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "DeckHub Anki deck",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition hover:border-sky-500"
      onClick={copyShareUrl}
      type="button"
    >
      <Share2 size={16} aria-hidden="true" />
      {copied ? "복사됨" : "공유"}
    </button>
  );
}
