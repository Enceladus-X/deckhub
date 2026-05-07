"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Heart,
  LayoutTemplate,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CardTemplatePreview } from "@/components/card-template-preview";
import { CopyCodeBlock } from "@/components/copy-code-block";
import { Badge, InfoList, SectionTitle, StatCard, Surface, cx } from "@/components/ui-kit";
import {
  cardTemplates,
  getScopedTemplateCss,
  getTemplateScopeClass,
} from "@/lib/card-templates";

const sample = {
  back: "정답은 반복 가능한 최소 단위로 쪼개고, 보충 설명에는 예외 조건이나 시험 포인트를 적습니다.",
  category: "IT",
  deckTitle: "정보처리기사",
  extra: "긴 문장은 뒷면 설명으로 분리하면 모바일 복습에서도 가독성이 유지됩니다.",
  front: "DeckHub 카드 템플릿은 무엇을 공유하나요?",
  version: "2026.05",
};

export function TemplateMarketplace() {
  const [activeTemplateId, setActiveTemplateId] = useState(cardTemplates[0].id);
  const [previewMode, setPreviewMode] = useState<"both" | "front" | "back">("both");
  const activeTemplate =
    cardTemplates.find((template) => template.id === activeTemplateId) ?? cardTemplates[0];
  const totalRecommendations = cardTemplates.reduce(
    (sum, template) => sum + template.recommendations,
    0,
  );
  const totalDownloads = cardTemplates.reduce(
    (sum, template) => sum + template.downloads,
    0,
  );
  const bundleCode = JSON.stringify(
    {
      id: activeTemplate.id,
      name: activeTemplate.name,
      author: activeTemplate.author,
      fields: ["Front", "Back", "Extra", "DeckTitle", "Version", "Category"],
      frontHtml: activeTemplate.frontHtml,
      backHtml: activeTemplate.backHtml,
      css: activeTemplate.css,
    },
    null,
    2,
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-6">
      <style>{cardTemplates.map(getScopedTemplateCss).join("\n\n")}</style>

      <Link
        className="text-sm font-medium text-zinc-500 transition hover:text-teal-700"
        href="/"
      >
        Catalog
      </Link>

      <div className="mt-4 space-y-5">
        <Surface className="p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <SectionTitle
              body="덱 업로더가 앞면 HTML, 뒷면 HTML, 카드 CSS를 고르고 바로 복사할 수 있는 템플릿 공유장입니다."
              eyebrow="Shared Card System"
              icon={Palette}
              title="카드 템플릿 공유장"
            />
            <Link
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-700 hover:shadow-sm"
              href="/upload/"
            >
              <LayoutTemplate size={17} aria-hidden="true" />
              업로드에서 사용
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={LayoutTemplate}
              label="공유 템플릿"
              value={cardTemplates.length}
            />
            <StatCard icon={Heart} label="추천 합계" value={totalRecommendations} />
            <StatCard icon={Download} label="사용 합계" value={totalDownloads} />
          </div>
        </Surface>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <Surface className="h-fit p-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-950">템플릿 선택</h2>
              <Badge tone="teal">{cardTemplates.length}</Badge>
            </div>

            <div className="mt-4 grid gap-2">
              {cardTemplates.map((template) => {
                const isActive = template.id === activeTemplate.id;

                return (
                  <button
                    className={cx(
                      "rounded-lg border p-3 text-left transition-all duration-200",
                      isActive
                        ? "border-teal-500 bg-teal-50 shadow-sm"
                        : "border-zinc-200 bg-white hover:border-teal-300 hover:bg-zinc-50",
                    )}
                    key={template.id}
                    onClick={() => setActiveTemplateId(template.id)}
                    type="button"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-zinc-950">{template.name}</span>
                      <span className="text-xs font-semibold text-zinc-500">
                        {template.downloads}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-zinc-500">
                      {template.summary}
                    </span>
                  </button>
                );
              })}
            </div>
          </Surface>

          <div className="space-y-5">
            <Surface className="overflow-hidden">
              <div className="border-b border-zinc-100 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-semibold leading-8 text-zinc-950">
                        {activeTemplate.name}
                      </h1>
                      <Badge tone={activeTemplate.tone === "exam" ? "amber" : "teal"}>
                        {activeTemplate.author}
                      </Badge>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
                      {activeTemplate.summary}
                    </p>
                  </div>

                  <div className="flex rounded-md border border-zinc-200 bg-white p-1">
                    {[
                      ["both", "앞/뒤"],
                      ["front", "앞면"],
                      ["back", "뒷면"],
                    ].map(([mode, label]) => (
                      <button
                        className={cx(
                          "h-9 rounded px-4 text-sm font-semibold transition-all duration-200",
                          previewMode === mode
                            ? "bg-zinc-950 text-white"
                            : "text-zinc-600 hover:bg-zinc-50",
                        )}
                        key={mode}
                        onClick={() => setPreviewMode(mode as typeof previewMode)}
                        type="button"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={cx(
                  "bg-white p-5",
                  getTemplateScopeClass(activeTemplate.id),
                )}
              >
                {previewMode === "both" ? (
                  <div className="grid gap-5 xl:grid-cols-2">
                    <CardTemplatePreview
                      back={sample.back}
                      category={sample.category}
                      className="p-10"
                      deckTitle={sample.deckTitle}
                      extra={sample.extra}
                      front={sample.front}
                      minHeight={500}
                      side="front"
                      template={activeTemplate}
                      version={sample.version}
                    />
                    <CardTemplatePreview
                      back={sample.back}
                      category={sample.category}
                      className="p-10"
                      deckTitle={sample.deckTitle}
                      extra={sample.extra}
                      front={sample.front}
                      minHeight={500}
                      side="back"
                      template={activeTemplate}
                      version={sample.version}
                    />
                  </div>
                ) : (
                  <CardTemplatePreview
                    back={sample.back}
                    category={sample.category}
                    className="mx-auto max-w-4xl p-10"
                    deckTitle={sample.deckTitle}
                    extra={sample.extra}
                    front={sample.front}
                    minHeight={560}
                    side={previewMode}
                    template={activeTemplate}
                    version={sample.version}
                  />
                )}
              </div>
            </Surface>

            <Surface className="p-5">
              <SectionTitle
                body="필요한 코드만 따로 복사하거나, JSON 패키지 전체를 가져가서 Anki 노트 타입에 붙일 수 있습니다."
                eyebrow="Copy Ready"
                icon={Sparkles}
                title="복사 가능한 템플릿 코드"
              />

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                <CopyCodeBlock
                  code={activeTemplate.frontHtml}
                  description="{{Front}}, {{DeckTitle}}, {{Version}} 필드를 사용합니다."
                  maxHeightClass="max-h-72"
                  title="앞면 HTML"
                />
                <CopyCodeBlock
                  code={activeTemplate.backHtml}
                  description="{{Back}}, {{Extra}} 필드를 사용합니다."
                  maxHeightClass="max-h-72"
                  title="뒷면 HTML"
                />
                <CopyCodeBlock
                  className="xl:col-span-2"
                  code={activeTemplate.css}
                  description="Anki 카드 스타일 영역에 붙여 넣는 CSS입니다."
                  maxHeightClass="max-h-96"
                  title="카드 CSS"
                />
                <CopyCodeBlock
                  className="xl:col-span-2"
                  code={bundleCode}
                  description="나중에 템플릿 업로드 API와 연결하기 쉬운 구조의 전체 패키지입니다."
                  maxHeightClass="max-h-96"
                  title="템플릿 패키지 JSON"
                  tone="light"
                />
              </div>
            </Surface>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Surface className="p-5">
                <SectionTitle
                  body="사용자가 직접 HTML/CSS 템플릿을 올릴 때 필요한 검수 기준입니다. 실제 저장 API가 붙으면 이 기준을 그대로 서버 검증으로 옮기면 됩니다."
                  eyebrow="Submission Rules"
                  icon={ShieldCheck}
                  title="공유 전 체크리스트"
                />
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {[
                    ["스크립트 금지", "HTML 구조와 CSS만 허용"],
                    ["필드 명확성", "{{Front}}, {{Back}}, {{Extra}} 사용"],
                    ["모바일 우선", "긴 문장과 작은 화면에서 가독성 확인"],
                  ].map(([title, body]) => (
                    <div
                      className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                      key={title}
                    >
                      <p className="text-sm font-semibold text-zinc-950">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
                    </div>
                  ))}
                </div>
              </Surface>

              <Surface className="p-5">
                <h2 className="text-lg font-semibold leading-7 text-zinc-950">
                  Anki 적용 흐름
                </h2>
                <div className="mt-4">
                  <InfoList
                    items={[
                      ["노트 필드", "Front / Back / Extra"],
                      ["앞면", "앞면 HTML 복사"],
                      ["뒷면", "뒷면 HTML 복사"],
                      ["스타일", "카드 CSS 복사"],
                    ]}
                  />
                </div>
              </Surface>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
