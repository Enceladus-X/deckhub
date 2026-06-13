"use client";

import { useState } from "react";
import Link from "next/link";
import { Code2, LayoutTemplate, Palette } from "lucide-react";
import { CardTemplatePreview } from "@/components/card-template-preview";
import { CopyCodeBlock } from "@/components/copy-code-block";
import { Badge, SectionTitle, Surface, cx } from "@/components/ui-kit";
import {
  cardTemplates,
  getScopedTemplateCss,
  getTemplateScopeClass,
} from "@/lib/card-templates";

const sample = {
  back: "Break the answer into repeatable minimum units, and keep exceptions or exam traps in the extra note.",
  category: "Language",
  deckTitle: "HSK Vocabulary",
  extra: "Use the extra field for examples, nuance, or source notes.",
  front: "What should a reusable Anki card template include?",
  version: "2026.06",
};

export function TemplateMarketplace() {
  const [activeTemplateId, setActiveTemplateId] = useState(cardTemplates[0].id);
  const [previewMode, setPreviewMode] = useState<"both" | "front" | "back">("both");
  const activeTemplate =
    cardTemplates.find((template) => template.id === activeTemplateId) ?? cardTemplates[0];
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
    <section className="mx-auto max-w-6xl px-5 py-6">
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
              body="Read-only card templates for decks published by the repository maintainer. Copy the HTML and CSS into Anki when preparing a release."
              eyebrow="Template Library"
              icon={Palette}
              title="Card template reference"
            />
            <a
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
              href="https://github.com/Enceladus-X/deckhub/blob/main/docs/publish-deck.md"
            >
              <LayoutTemplate size={17} aria-hidden="true" />
              Publish guide
            </a>
          </div>
        </Surface>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <Surface className="h-fit p-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-950">Templates</h2>
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
                    <span className="font-semibold text-zinc-950">{template.name}</span>
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
                      ["both", "Both"],
                      ["front", "Front"],
                      ["back", "Back"],
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

              <div className={cx("bg-white p-5", getTemplateScopeClass(activeTemplate.id))}>
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
                body="Copy only the part you need, or copy the full JSON package for archive notes."
                eyebrow="Copy Ready"
                icon={Code2}
                title="Template code"
              />

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                <CopyCodeBlock
                  code={activeTemplate.frontHtml}
                  description="Uses {{Front}}, {{DeckTitle}}, and {{Version}}."
                  maxHeightClass="max-h-72"
                  title="Front HTML"
                />
                <CopyCodeBlock
                  code={activeTemplate.backHtml}
                  description="Uses {{Back}} and {{Extra}}."
                  maxHeightClass="max-h-72"
                  title="Back HTML"
                />
                <CopyCodeBlock
                  className="xl:col-span-2"
                  code={activeTemplate.css}
                  description="Scoped CSS for Anki card styling."
                  maxHeightClass="max-h-96"
                  title="Card CSS"
                />
                <CopyCodeBlock
                  className="xl:col-span-2"
                  code={bundleCode}
                  description="Full template package for maintainer notes."
                  maxHeightClass="max-h-96"
                  title="Template JSON"
                  tone="light"
                />
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </section>
  );
}
