"use client";

import { useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import { cx } from "@/components/ui-kit";

type CopyCodeBlockProps = {
  className?: string;
  code: string;
  description?: string;
  maxHeightClass?: string;
  title: string;
  tone?: "dark" | "light";
};

export function CopyCodeBlock({
  className,
  code,
  description,
  maxHeightClass = "max-h-80",
  title,
  tone = "dark",
}: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const isDark = tone === "dark";

  async function copyCode() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        copyWithFallback(code);
      }
    } catch {
      copyWithFallback(code);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section
      className={cx(
        "rounded-lg border p-4 transition-all duration-200",
        isDark
          ? "border-zinc-800 bg-zinc-950 text-white"
          : "border-zinc-200 bg-white text-zinc-950",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Code2
              size={18}
              className={isDark ? "text-teal-300" : "text-teal-600"}
              aria-hidden="true"
            />
            <h3 className="text-base font-semibold">{title}</h3>
          </div>
          {description ? (
            <p
              className={cx(
                "mt-1 text-sm leading-6",
                isDark ? "text-zinc-300" : "text-zinc-500",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        <button
          className={cx(
            "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-all duration-200",
            isDark
              ? "bg-white/10 text-white hover:bg-white/15"
              : "bg-zinc-950 text-white hover:bg-teal-700",
          )}
          onClick={copyCode}
          type="button"
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>

      <pre
        className={cx(
          "mt-4 overflow-auto rounded-md p-4 font-mono text-xs leading-5",
          maxHeightClass,
          isDark ? "bg-black/35 text-zinc-100" : "bg-zinc-950 text-zinc-100",
        )}
      >
        <code>{code}</code>
      </pre>
    </section>
  );
}

function copyWithFallback(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
