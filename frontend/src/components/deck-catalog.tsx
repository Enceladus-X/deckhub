"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Download,
  GitBranch,
  MessageSquare,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";
import type { Deck } from "@/lib/deck-data";

type DeckCatalogProps = {
  categories: string[];
  decks: Deck[];
  query: string;
};

type SortMode = "추천순" | "최신순" | "다운로드순" | "카드많은순";

export function DeckCatalog({ categories, decks, query }: DeckCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("추천순");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredDecks = useMemo(() => {
    const result = decks.filter((deck) => {
      const matchesCategory =
        activeCategory === "전체" || deck.category === activeCategory;
      const searchable = [
        deck.title,
        deck.code,
        deck.category,
        deck.examTrack,
        deck.description,
        deck.subjects.join(" "),
        deck.aliases.join(" "),
        deck.uploader,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchable.includes(normalizedQuery);
    });

    return result.sort((a, b) => {
      if (sortMode === "최신순") {
        return b.updatedAt.localeCompare(a.updatedAt);
      }
      if (sortMode === "다운로드순") {
        return b.downloads - a.downloads;
      }
      if (sortMode === "카드많은순") {
        return b.cards - a.cards;
      }
      return b.recommendations - a.recommendations;
    });
  }, [activeCategory, decks, normalizedQuery, sortMode]);

  const totalCards = decks.reduce((sum, deck) => sum + deck.cards, 0);
  const totalDownloads = decks.reduce((sum, deck) => sum + deck.downloads, 0);

  return (
    <section className="mx-auto max-w-7xl px-5 py-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700">
              Q-Net 기반 공유 아카이브
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-8 text-zinc-950">
              전체 과목
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              과목을 한 줄씩 훑고, 필요한 항목만 펼쳐 최신 버전과 샘플 카드를 확인합니다.
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

        <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
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

          <label className="flex items-center gap-2 text-sm text-zinc-500">
            정렬
            <select
              className="h-9 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-medium text-zinc-700 outline-none focus:border-teal-600 focus:bg-white"
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              value={sortMode}
            >
              <option>추천순</option>
              <option>최신순</option>
              <option>다운로드순</option>
              <option>카드많은순</option>
            </select>
          </label>
        </div>

        <div className="mt-5 space-y-3">
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
                  className="grid w-full gap-4 p-4 text-left lg:grid-cols-[1fr_420px_28px] lg:items-center"
                  onClick={() =>
                    setExpandedSlug((current) =>
                      current === deck.slug ? null : deck.slug,
                    )
                  }
                  type="button"
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-500">
                        {deck.category}
                      </span>
                      <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                        {deck.status}
                      </span>
                      {deck.reports > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                          <AlertCircle size={12} aria-hidden="true" />
                          신고 {deck.reports}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-xl font-semibold leading-7 text-zinc-950">
                      {deck.title}
                    </span>
                    <span className="mt-1 block text-sm text-zinc-500">
                      {deck.examTrack} · {deck.code}
                    </span>
                  </span>

                  <span className="grid grid-cols-2 gap-2 text-sm text-zinc-600 sm:grid-cols-4">
                    <span className="rounded-md bg-zinc-50 px-3 py-2">
                      v{deck.version}
                    </span>
                    <span className="rounded-md bg-zinc-50 px-3 py-2">
                      {deck.cards.toLocaleString()} cards
                    </span>
                    <span className="rounded-md bg-zinc-50 px-3 py-2">
                      {deck.recommendations.toLocaleString()} 추천
                    </span>
                    <span className="rounded-md bg-zinc-50 px-3 py-2">
                      {deck.downloads.toLocaleString()} DL
                    </span>
                  </span>

                  <ChevronDown
                    size={18}
                    className={`mt-1 shrink-0 text-zinc-400 transition lg:mt-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isExpanded ? (
                  <div className="border-t border-zinc-100 px-4 pb-4">
                    <div className="grid gap-4 pt-4 lg:grid-cols-[1fr_280px]">
                      <div>
                        <p className="text-sm leading-6 text-zinc-600">
                          {deck.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {deck.subjects.slice(0, 5).map((subject) => (
                            <span
                              className="rounded-md bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600"
                              key={subject}
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 rounded-md bg-zinc-50 p-3 text-sm leading-6 text-zinc-600">
                          {deck.versions[0]?.changelog}
                        </p>
                      </div>

                      <div className="grid content-start gap-2">
                        <div className="grid grid-cols-2 gap-2 text-sm text-zinc-600">
                          <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                            <ShieldCheck size={15} aria-hidden="true" />
                            {deck.qualityScore}점
                          </span>
                          <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                            <GitBranch size={15} aria-hidden="true" />
                            {deck.updatedAt}
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

                        <div className="grid grid-cols-2 gap-2">
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
                            다운로드
                          </button>
                        </div>
                      </div>
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
              아직 없는 과목이라면 첫 번째 덱을 업로드해 보세요.
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
