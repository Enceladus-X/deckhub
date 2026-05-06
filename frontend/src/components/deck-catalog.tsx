"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  ChevronDown,
  Download,
  FileArchive,
  GitBranch,
  LibraryBig,
  MessageSquare,
  ShieldCheck,
  ThumbsUp,
  UploadCloud,
} from "lucide-react";
import type { Deck } from "@/lib/deck-data";
import { Badge, cx, StatCard, Surface } from "@/components/ui-kit";

type DeckCatalogProps = {
  categories: string[];
  decks: Deck[];
  query: string;
};

type SortMode = "추천순" | "최신순" | "다운로드순" | "카드많은순";

const sortModes: SortMode[] = ["추천순", "최신순", "다운로드순", "카드많은순"];

const sortLabels: Record<SortMode, string> = {
  추천순: "추천",
  최신순: "최신",
  다운로드순: "다운로드",
  카드많은순: "카드 수",
};

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
        deck.category,
        deck.examTrack,
        deck.description,
        deck.uploader,
        deck.sourceName,
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
  const averageQuality = Math.round(
    decks.reduce((sum, deck) => sum + deck.qualityScore, 0) / decks.length,
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-6">
      <Surface className="overflow-hidden">
        <div className="border-b border-zinc-100 bg-zinc-950 px-5 py-5 text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-teal-100">
                <LibraryBig size={15} aria-hidden="true" />
                Certification Deck Library
              </div>
              <h1 className="mt-3 text-3xl font-semibold leading-10">
                필요한 자격증 덱을 빠르게 찾고 검증해서 받습니다.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                추천, 최신성, 카드 수, 검수 정보를 한 줄에서 비교하고 필요한 덱만 펼쳐봅니다.
              </p>
            </div>

            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs font-semibold text-zinc-300">과목</p>
                <p className="mt-1 text-2xl font-semibold">{decks.length}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs font-semibold text-zinc-300">카드</p>
                <p className="mt-1 text-2xl font-semibold">
                  {totalCards.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs font-semibold text-zinc-300">품질 평균</p>
                <p className="mt-1 text-2xl font-semibold">{averageQuality}점</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[250px_1fr]">
          <aside className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-zinc-950">분야</p>
              <div className="mt-3 grid gap-2">
                {categories.map((category) => {
                  const count =
                    category === "전체"
                      ? decks.length
                      : decks.filter((deck) => deck.category === category).length;
                  const isActive = activeCategory === category;

                  return (
                    <button
                      className={cx(
                        "flex h-10 items-center justify-between rounded-lg border px-3 text-sm font-semibold transition",
                        isActive
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-teal-500 hover:text-teal-700",
                      )}
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
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm font-semibold text-zinc-950">카탈로그 상태</p>
              <div className="mt-3 space-y-2">
                <StatCard label="다운로드" value={totalDownloads.toLocaleString()} />
                <StatCard label="검증 평균" value={`${averageQuality}점`} />
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-3 border-b border-zinc-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  {activeCategory} 결과 {filteredDecks.length}개
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  한 줄 목록에서 핵심 지표를 보고 클릭하면 다운로드 정보가 열립니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
                {sortModes.map((mode) => {
                  const isActive = sortMode === mode;

                  return (
                    <button
                      className={cx(
                        "h-9 rounded-md px-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-zinc-950 text-white shadow-sm"
                          : "text-zinc-600 hover:bg-white hover:text-teal-700",
                      )}
                      key={mode}
                      onClick={() => setSortMode(mode)}
                      type="button"
                    >
                      {sortLabels[mode]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {filteredDecks.map((deck) => {
                const isExpanded = expandedSlug === deck.slug;

                return (
                  <article
                    className={cx(
                      "rounded-lg border bg-white transition",
                      isExpanded
                        ? "border-teal-300 shadow-md shadow-teal-100"
                        : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm",
                    )}
                    key={deck.slug}
                  >
                    <button
                      aria-expanded={isExpanded}
                      className="grid w-full gap-4 p-4 text-left xl:grid-cols-[1fr_430px_28px] xl:items-center"
                      onClick={() =>
                        setExpandedSlug((current) =>
                          current === deck.slug ? null : deck.slug,
                        )
                      }
                      type="button"
                    >
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <Badge>{deck.category}</Badge>
                          <Badge tone={deck.status === "최신" ? "teal" : "zinc"}>
                            {deck.status}
                          </Badge>
                          {deck.reports > 0 ? (
                            <Badge tone="amber">
                              <span className="inline-flex items-center gap-1">
                                <AlertCircle size={12} aria-hidden="true" />
                                신고 {deck.reports}
                              </span>
                            </Badge>
                          ) : null}
                        </span>
                        <span className="mt-2 block text-xl font-semibold leading-7 text-zinc-950">
                          {deck.title}
                        </span>
                        <span className="mt-1 block line-clamp-2 text-sm leading-6 text-zinc-500">
                          {deck.description}
                        </span>
                      </span>

                      <span className="grid grid-cols-2 gap-2 text-sm text-zinc-600 sm:grid-cols-4">
                        <Metric label="버전" value={`v${deck.version}`} />
                        <Metric label="카드" value={deck.cards.toLocaleString()} />
                        <Metric label="추천" value={deck.recommendations.toLocaleString()} />
                        <Metric label="다운로드" value={deck.downloads.toLocaleString()} />
                      </span>

                      <ChevronDown
                        size={18}
                        className={cx(
                          "mt-1 shrink-0 text-zinc-400 transition xl:mt-0",
                          isExpanded && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {isExpanded ? (
                      <div className="border-t border-zinc-100 px-4 pb-4">
                        <div className="grid gap-4 pt-4 lg:grid-cols-[1fr_300px]">
                          <div className="rounded-lg bg-zinc-50 p-4">
                            <p className="text-sm font-semibold text-zinc-950">
                              최신 변경
                            </p>
                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                              {deck.versions[0]?.changelog}
                            </p>
                            <p className="mt-3 text-xs font-medium text-zinc-500">
                              업로더 {deck.uploader} · 검증일 {deck.verifiedAt}
                            </p>
                          </div>

                          <div className="grid content-start gap-2">
                            <div className="grid grid-cols-2 gap-2 text-sm text-zinc-600">
                              <Metric
                                icon={ShieldCheck}
                                label="품질"
                                value={`${deck.qualityScore}점`}
                              />
                              <Metric
                                icon={GitBranch}
                                label="업데이트"
                                value={deck.updatedAt}
                              />
                              <Metric
                                icon={ThumbsUp}
                                label="추천"
                                value={deck.recommendations.toLocaleString()}
                              />
                              <Metric
                                icon={MessageSquare}
                                label="댓글"
                                value={deck.comments.length}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition hover:border-teal-500 hover:text-teal-700"
                                href={`/decks/${deck.slug}/`}
                              >
                                상세보기
                                <ArrowUpRight size={15} aria-hidden="true" />
                              </Link>
                              <button
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
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
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                  href="/upload/"
                >
                  <UploadCloud size={16} aria-hidden="true" />
                  업로드
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </Surface>
    </section>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon?: typeof FileArchive;
}) {
  return (
    <span className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
        {Icon ? <Icon size={13} aria-hidden="true" /> : null}
        {label}
      </span>
      <span className="mt-1 block font-semibold text-zinc-900">{value}</span>
    </span>
  );
}
