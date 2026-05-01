"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

type ReportButtonProps = {
  slug: string;
};

export function ReportButton({ slug }: ReportButtonProps) {
  const [reported, setReported] = useState(false);

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition ${
        reported
          ? "border-amber-300 bg-amber-50 text-amber-700"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-400 hover:text-amber-700"
      }`}
      onClick={() => setReported(true)}
      type="button"
    >
      <Flag size={16} aria-hidden="true" />
      {reported ? "신고 접수" : "신고"}
      <span className="sr-only">{slug}</span>
    </button>
  );
}
