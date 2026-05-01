"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
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
  const [selectedSlug, setSelectedSlug] = useState(decks[0]?.slug ?? "");

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

  const selectedDeck =
    filteredDecks.find((deck) => deck.slug === selectedSlug) ??
    filteredDecks[0] ??
    decks[0];

  const totalCards = decks.reduce((sum, deck) => sum + deck.cards, 0);
  const totalDownloads = decks.reduce((sum, deck) => sum + deck.downloads, 0);

  function selectCategory(category: string) {
    setActiveCategory(category);
    setSelectedSlug("");
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-6">
      <div className="grid gap-5 lg:grid-cols-[220px_1fr_360px]">
        <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-sm font-semibold text-zinc-900">분류</p>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {categories.map((category) => {
              const count =
                category === "전체"
                  ? decks.length
                  : decks.filter((deck) => deck.category === category).length;
              const isActive = activeCategory === category;

              return (
                <button
                  className={`flex h-10 items-center justify-between rounded-md px-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                  key={category}
                  onClick={() => selectCategory(category)}
                  type="button"
                >
                  <span>{category}</span>
                  <span
                    className={isActive ? "text-zinc-300" : "text-zinc-400"}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-4">
          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-700">
                  Q-Net 기반 프로토타입
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-8 text-zinc-950">
                  과목을 먼저 고르고, 덱은 나중에 확인하세요
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  메인 화면은 과목 탐색에 집중하고, 선택한 과목의 버전과 커뮤니티 정보만 옆 패널에서 보여줍니다.
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

            <div className="relative mt-5">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedSlug("");
                }}
                placeholder="정보처리기사, 전기, 토목처럼 검색"
                value={query}
              />
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <p className="text-sm font-semibold text-zinc-900">
                {activeCategory} 과목
              </p>
              <p className="text-xs text-zinc-500">
                {filteredDecks.length}개 표시
              </p>
            </div>

            <div className="divide-y divide-zinc-100">
              {filteredDecks.map((deck) => {
                const isSelected = selectedDeck?.slug === deck.slug;

                return (
                  <button
                    className={`grid w-full gap-3 px-4 py-4 text-left transition md:grid-cols-[1fr_auto] md:items-center ${
                      isSelected ? "bg-teal-50" : "hover:bg-zinc-50"
                    }`}
                    key={deck.slug}
                    onClick={() => setSelectedSlug(deck.slug)}
                    type="button"
                  >
                    <span>
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold leading-7 text-zinc-950">
                          {deck.title}
                        </span>
                        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                          {deck.category}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-zinc-500">
                        {deck.examTrack} · {deck.code}
                      </span>
                    </span>
                    <span className="flex flex-wrap gap-2 text-xs text-zinc-500 md:justify-end">
                      <span className="rounded-md bg-white px-2 py-1 ring-1 ring-zinc-200">
                        v{deck.version}
                      </span>
                      <span className="rounded-md bg-white px-2 py-1 ring-1 ring-zinc-200">
                        {deck.cards.toLocaleString()} cards
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredDecks.length === 0 ? (
              <div className="px-4 py-12 text-center">
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
          </section>
        </div>

        {selectedDeck ? (
          <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5 lg:sticky lg:top-5">
            <div className={`border-l-4 pl-4 ${selectedDeck.accent}`}>
              <p className="text-sm font-semibold text-zinc-500">
                {selectedDeck.category}
              </p>
              <h2 className="mt-1 text-2xl font-semibold leading-8 text-zinc-950">
                {selectedDeck.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {selectedDeck.description}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-sm text-zinc-600">
              <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                <GitBranch size={15} aria-hidden="true" />
                v{selectedDeck.version}
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                <FileArchive size={15} aria-hidden="true" />
                {selectedDeck.cards.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                <ThumbsUp size={15} aria-hidden="true" />
                {selectedDeck.recommendations.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-3 py-2">
                <MessageSquare size={15} aria-hidden="true" />
                {selectedDeck.comments.length}
              </span>
            </div>

            <div className="mt-5 rounded-md bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase text-zinc-400">
                최신 변경
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {selectedDeck.versions[0]?.changelog}
              </p>
            </div>

            <div className="mt-5 grid gap-2">
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                href={`/decks/${selectedDeck.slug}/`}
              >
                상세 보기
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-teal-500"
                type="button"
              >
                <Download size={16} aria-hidden="true" />
                Download
              </button>
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
