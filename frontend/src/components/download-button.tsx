"use client";

import { useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";

type DownloadButtonProps = {
  versionId: string;
};

export function DownloadButton({ versionId }: DownloadButtonProps) {
  const [state, setState] = useState<"idle" | "signing" | "ready">("idle");

  async function requestDownload() {
    setState("signing");
    await new Promise((resolve) => setTimeout(resolve, 350));
    setState("ready");
  }

  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-wait disabled:bg-zinc-700"
      disabled={state === "signing"}
      onClick={requestDownload}
      type="button"
    >
      {state === "signing" ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : state === "ready" ? (
        <CheckCircle2 size={16} aria-hidden="true" />
      ) : (
        <Download size={16} aria-hidden="true" />
      )}
      {state === "ready" ? "Signed URL 준비됨" : "다운로드"}
      <span className="sr-only">{versionId}</span>
    </button>
  );
}
