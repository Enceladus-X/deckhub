"use client";

import { Download, FileArchive, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import {
  type DeckManifest,
  formatBytes,
  formatCount,
  getLatestVersion,
  releaseLabel,
} from "@/lib/catalog";

type CatalogBrowserProps = {
  decks: DeckManifest[];
  categories: string[];
};

const sortOptions = [
  { id: "recent", label: "최신" },
  { id: "cards", label: "카드 수" },
  { id: "title", label: "이름" },
] as const;

type SortOption = (typeof sortOptions)[number]["id"];

export function CatalogBrowser({ decks, categories }: CatalogBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("recent");

  const filteredDecks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return decks
      .filter((deck) => category === "all" || deck.category === category)
      .filter((deck) => {
        if (!normalizedQuery) {
          return true;
        }

        return [
          deck.title,
          deck.summary,
          deck.category,
          deck.exam.name,
          deck.exam.provider,
          ...(deck.exam.scope || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((left, right) => {
        const leftVersion = getLatestVersion(left);
        const rightVersion = getLatestVersion(right);

        if (sort === "cards") {
          return (rightVersion?.stats.cards || 0) - (leftVersion?.stats.cards || 0);
        }

        if (sort === "title") {
          return left.title.localeCompare(right.title);
        }

        return (rightVersion?.releasedAt || "").localeCompare(leftVersion?.releasedAt || "");
      });
  }, [category, decks, query, sort]);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-teal-700">
              Catalog
            </p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-950">공개 덱</h2>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                size={17}
              />
              <input
                className="h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white sm:w-72"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="시험명, 범위, 설명 검색"
                value={query}
              />
            </label>
            <div className="flex rounded-md border border-zinc-200 bg-zinc-50 p-1">
              {sortOptions.map((option) => (
                <button
                  className={`h-8 rounded px-3 text-sm font-medium transition ${
                    sort === option.id
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:bg-white"
                  }`}
                  key={option.id}
                  onClick={() => setSort(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            className={`h-9 shrink-0 rounded-md border px-3 text-sm font-medium transition ${
              category === "all"
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
            onClick={() => setCategory("all")}
            type="button"
          >
            전체 {decks.length}
          </button>
          {categories.map((item) => (
            <button
              className={`h-9 shrink-0 rounded-md border px-3 text-sm font-medium transition ${
                category === item
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item} {decks.filter((deck) => deck.category === item).length}
            </button>
          ))}
        </div>
      </div>

      {filteredDecks.length === 0 ? (
        <div className="mx-4 my-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center sm:mx-5 sm:my-5">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-white text-zinc-950 shadow-sm">
            <FileArchive aria-hidden="true" size={24} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-zinc-950">
            아직 공개된 덱이 없습니다
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
            APKG 파일은 GitHub Release에 올리고, `decks/` manifest가 병합되면 이 목록에
            자동으로 표시됩니다.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <a
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
              href="https://github.com/Enceladus-X/deckhub/issues/new?template=deck_submission.yml"
            >
              덱 제출하기
            </a>
            <a
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
              href="https://github.com/Enceladus-X/deckhub/tree/main/decks"
            >
              manifest 보기
            </a>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-zinc-200">
          {filteredDecks.map((deck) => {
            const latestVersion = getLatestVersion(deck);

            return (
              <article className="p-4 transition hover:bg-zinc-50 sm:p-5" key={deck.slug}>
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        className="text-lg font-semibold text-zinc-950 transition hover:text-teal-700"
                        href={`https://github.com/Enceladus-X/deckhub/blob/main/${deck.manifestPath}`}
                      >
                        {deck.title}
                      </a>
                      <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">
                        {deck.category}
                      </span>
                      <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600">
                        {deck.exam.name}
                      </span>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                      {deck.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                      <span>{releaseLabel(latestVersion)}</span>
                      {latestVersion ? (
                        <>
                          <span>카드 {formatCount(latestVersion.stats.cards)}</span>
                          <span>세그먼트 {formatCount(latestVersion.segments.length)}</span>
                          <span>{formatBytes(latestVersion.apkg.sizeBytes)}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {latestVersion ? (
                    <a
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                      href={latestVersion.apkg.downloadUrl}
                    >
                      <Download aria-hidden="true" size={17} />
                      다운로드
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-500 sm:px-5">
        <SlidersHorizontal aria-hidden="true" size={14} />
        SHA256 중복, slug 중복, 버전 manifest는 GitHub Actions에서 검증됩니다.
      </div>
    </section>
  );
}
