import type { CSSProperties } from "react";
import type { CardTemplate } from "@/lib/card-templates";
import { cx } from "@/components/ui-kit";

type CardTemplatePreviewProps = {
  back: string;
  category?: string;
  className?: string;
  deckTitle: string;
  extra: string;
  front: string;
  minHeight?: number;
  side: "front" | "back";
  template: CardTemplate;
  version: string;
};

export function CardTemplatePreview({
  back,
  category = "IT",
  className,
  deckTitle,
  extra,
  front,
  minHeight,
  side,
  template,
  version,
}: CardTemplatePreviewProps) {
  const isBack = side === "back";
  const style: CSSProperties | undefined = minHeight ? { minHeight } : undefined;

  return (
    <div
      className={cx(
        "deckhub-card motion-safe:animate-soft-enter flex flex-col justify-between p-8 shadow-sm transition-all duration-300",
        template.tone === "dark" && "shadow-zinc-950/20",
        className,
      )}
      style={style}
    >
      <div>
        <p className="deckhub-card__label">
          {isBack
            ? template.id === "exam-contrast"
              ? "Key Answer"
              : "Answer"
            : template.id === "night-focus"
              ? "Focus"
              : "Question"}
        </p>

        {isBack ? (
          <div className="mt-5 space-y-6">
            <p className="deckhub-card__answer">{back || "뒷면 내용을 입력하세요."}</p>
            <p className="deckhub-card__note rounded-md p-4 text-base">
              {extra || "보충 설명을 입력하면 이 영역에 표시됩니다."}
            </p>
          </div>
        ) : (
          <p className="deckhub-card__question mt-5">
            {front || "앞면 내용을 입력하세요."}
          </p>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-current/15 pt-4 text-sm opacity-70">
        <span>{template.id === "exam-contrast" ? category : deckTitle}</span>
        <span>v{version}</span>
      </div>
    </div>
  );
}
