"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  FileArchive,
  GitBranch,
  MessageSquare,
  Search,
  ThumbsUp,
} from "lucide-react";
import type { Deck } from "@/lib/deck-data";

type DeckCatalogProps = {
  categories: string[];
  decks: Deck[];
};

export function DeckCatalog({ categories, decks }: DeckCatalogProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredDecks = useMemo(
    () =>
      decks.filter((deck) => {
        const matchesCategory =
          activeCategory === "전체" || deck.category === activeCategory;
        const searchable = [
          deck.title,
          deck.code,
          deck.category,
          deck.examTrack,
          deck.description,
        ]
          .join(" ")
          .toLowerCase();

        return matchesCategory && searchable.includes(normalizedQuery);
      }),
    [activeCategory, decks, normalizedQuery],
  );

  const totalCards = decks.reduce((sum, deck) => sum + deck.cards, 0);
  const totalDownloads = decks.reduce((sum, deck) => sum + deck.downloads, 0);

  return (
    <section className="mx-auto max-w-7xl px-5 py-6">
      <div className="mb-5 rounded-lg border border-zinc-200 bg-white p-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            className="h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-10 pr-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
            onChange={(event) => {
              setQuery(event.target.value);
              setExpandedSlug(null);
            }}
            placeholder="과목명, 분류, 종목코드 검색"
            value={query}
          />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700">
              Q-Net 기반 프로토타입
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-8 text-zinc-950">
              전체 과목
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              과목을 클릭하면 설명, 최신 버전, 다운로드 액션이 카드 아래로 펼쳐집니다.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md border border-zinc-200 px-3 py-2">
              <p className="font-semibold text-zinc-900">{decks.length}</p>
              <p className="text-xs text-zinc-500">과목</p>
            </div>
            <div className="rounded-md border border-zinc-200 px-3 py-2">
              <p className="font-semibold text-zinc-900">
                {totalCards.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500">카드</p>
            </div>
            <div className="rounded-md border border-zinc-200 px-3 py-2">
              <p className="font-semibold text-zinc-900">
                {totalDownloads.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500">다운로드</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const count =
              category === "전체"
                ? decks.length
                : decks.filter((deck) => deck.category === category).length;
            const isActive = activeCategory === category;

            return (
              <button
                className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 text-zinc-600 hover:border-teal-500 hover:text-teal-700"
                }`}
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setExpandedSlug(null);
                }}
                type="button"
              >
                <span>{category}</span>
                <span className={isActive ? "text-zinc-300" : "text-zinc-400"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredDecks.map((deck) => {
            const isExpanded = expandedSlug === deck.slug;

            return (
              <article
                className={`rounded-lg border border-l-4 ${deck.accent} bg-white shadow-sm transition ${
                  isExpanded ? "ring-2 ring-teal-100" : "hover:shadow-md"
                }`}
                key={deck.slug}
              >
                <button
                  aria-expanded={isExpanded}
                  className="flex w-full items-start justify-between gap-4 p-4 text-left"
                  onClick={() =>
                    setExpandedSlug((current) =>
                      current === deck.slug ? null : deck.slug,
                    )
                  }
                  type="button"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-zinc-500">
                      {deck.category}
                    </span>
                    <span className="mt-1 block text-xl font-semibold leading-7 text-zinc-950">
                      {deck.title}
                    </span>
                    <span className="mt-1 block text-sm text-zinc-500">
                      {deck.examTrack}
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`mt-1 shrink-0 text-zinc-400 transition ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isExpanded ? (
                  <div className="border-t border-zinc-100 px-4 pb-4">
                    <p className="pt-4 text-sm leading-6 text-zinc-600">
                      {deck.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-600">
                      <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                        <GitBranch size={15} aria-hidden="true" />
                        v{deck.version}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                        <FileArchive size={15} aria-hidden="true" />
                        {deck.cards.toLocaleString()} cards
                      </span>
                      <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                        <ThumbsUp size={15} aria-hidden="true" />
                        {deck.recommendations.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                        <MessageSquare size={15} aria-hidden="true" />
                        {deck.comments.length}
                      </span>
                    </div>

                    <p className="mt-4 rounded-md bg-zinc-50 p-3 text-sm leading-6 text-zinc-600">
                      {deck.versions[0]?.changelog}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition hover:border-teal-500"
                        href={`/decks/${deck.slug}/`}
                      >
                        상세보기
                      </Link>
                      <button
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                        type="button"
                      >
                        <Download size={16} aria-hidden="true" />
                        Download
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {filteredDecks.length === 0 ? (
          <div className="mt-5 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
            <p className="text-base font-semibold text-zinc-800">
              검색 결과가 없습니다
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              아직 없는 과목이라면 첫 번째 덱을 업로드해보세요.
            </p>
            <Link
              className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
              href="/upload/"
            >
              업로드
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
