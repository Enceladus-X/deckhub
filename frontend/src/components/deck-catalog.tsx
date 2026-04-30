"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarClock,
  Download,
  FileArchive,
  GitBranch,
  MessageSquare,
  Search,
  Star,
  ThumbsUp,
} from "lucide-react";
import type { Deck } from "@/lib/deck-data";

type DeckCatalogProps = {
  decks: Deck[];
  providers: string[];
};

type SortKey = "recommended" | "latest" | "comments" | "downloads";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "추천순", value: "recommended" },
  { label: "최신순", value: "latest" },
  { label: "댓글순", value: "comments" },
  { label: "다운로드", value: "downloads" },
];

export function DeckCatalog({ decks, providers }: DeckCatalogProps) {
  const [query, setQuery] = useState("");
  const [activeProvider, setActiveProvider] = useState("전체");
  const [sortBy, setSortBy] = useState<SortKey>("recommended");

  const totalCards = decks.reduce((sum, deck) => sum + deck.cards, 0);
  const totalDownloads = decks.reduce((sum, deck) => sum + deck.downloads, 0);
  const totalComments = decks.reduce(
    (sum, deck) => sum + deck.comments.length,
    0,
  );
  const normalizedQuery = query.trim().toLowerCase();

  const filteredDecks = decks
    .filter((deck) => {
      const matchesProvider =
        activeProvider === "전체" || deck.provider === activeProvider;
      const searchable = [
        deck.title,
        deck.code,
        deck.provider,
        deck.examTrack,
        deck.description,
        ...deck.tags,
      ]
        .join(" ")
        .toLowerCase();

      return matchesProvider && searchable.includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (sortBy === "latest") {
        return right.version.localeCompare(left.version);
      }

      if (sortBy === "comments") {
        return right.comments.length - left.comments.length;
      }

      if (sortBy === "downloads") {
        return right.downloads - left.downloads;
      }

      return right.recommendations - left.recommendations;
    });

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="자격명, 종목코드, 과목 검색"
            value={query}
          />
        </div>

        <div className="mt-5 space-y-2">
          {providers.map((provider) => {
            const isActive = activeProvider === provider;

            return (
              <button
                className={`flex h-10 w-full items-center justify-between rounded-md px-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
                key={provider}
                onClick={() => setActiveProvider(provider)}
                type="button"
              >
                <span>{provider}</span>
                <span className="text-xs text-zinc-400">
                  {provider === "전체"
                    ? decks.length
                    : decks.filter((deck) => deck.provider === provider).length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 border-t border-zinc-100 pt-5">
          <p className="text-sm font-semibold text-zinc-800">정렬</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {sortOptions.map((option) => {
              const isActive = sortBy === option.value;

              return (
                <button
                  className={`h-9 rounded-md border text-xs font-medium transition ${
                    isActive
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-zinc-200 text-zinc-600 hover:border-teal-500 hover:text-teal-700"
                  }`}
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="space-y-5">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold leading-8">
                Q-Net 자격시험 Anki 덱
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                국가기술자격과 국가전문자격을 과목별로 정리하는 커뮤니티 아카이브입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
              <span className="flex items-center gap-1.5">
                <FileArchive size={16} aria-hidden="true" />
                {decks.length} decks
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={16} aria-hidden="true" />
                {totalCards.toLocaleString()} cards
              </span>
              <span className="flex items-center gap-1.5">
                <Download size={16} aria-hidden="true" />
                {totalDownloads.toLocaleString()} downloads
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare size={16} aria-hidden="true" />
                {totalComments} comments
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredDecks.map((deck) => (
            <article
              className={`rounded-lg border border-l-4 ${deck.accent} bg-white p-5 shadow-sm`}
              key={deck.code}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      className="text-lg font-semibold leading-7 text-zinc-950 transition hover:text-teal-700"
                      href={`/decks/${deck.slug}/`}
                    >
                      {deck.title}
                    </Link>
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                      {deck.code}
                    </span>
                    <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                      {deck.status}
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                    {deck.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {deck.tags.map((tag) => (
                      <span
                        className="rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-500"
                        key={tag}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <GitBranch size={15} aria-hidden="true" />
                      v{deck.version}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileArchive size={15} aria-hidden="true" />
                      {deck.cards.toLocaleString()} cards
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ThumbsUp size={15} aria-hidden="true" />
                      {deck.recommendations.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={15} aria-hidden="true" />
                      {deck.comments.length}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarClock size={15} aria-hidden="true" />
                      {deck.downloads.toLocaleString()} downloads
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-teal-500"
                    href={`/decks/${deck.slug}/`}
                  >
                    상세
                  </Link>
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                    type="button"
                  >
                    <Download size={17} aria-hidden="true" />
                    Download
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredDecks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <p className="text-base font-semibold text-zinc-800">
              검색 결과가 없습니다
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              아직 없는 자격 종목이라면 첫 번째 덱을 업로드해보세요.
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
