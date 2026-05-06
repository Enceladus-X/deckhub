import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Download,
  FileArchive,
  GitBranch,
  Hash,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { CommentThread } from "@/components/comment-thread";
import { DownloadButton } from "@/components/download-button";
import { RecommendButton } from "@/components/recommend-button";
import { ReportButton } from "@/components/report-button";
import { ShareButton } from "@/components/share-button";
import { Badge, InfoList, SectionTitle, StatCard, Surface } from "@/components/ui-kit";
import { decks, getDeckBySlug } from "@/lib/deck-data";

export function generateStaticParams() {
  return decks.map((deck) => ({ slug: deck.slug }));
}

type DeckDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DeckDetailPage({ params }: DeckDetailPageProps) {
  const { slug } = await params;
  const deck = getDeckBySlug(slug);

  if (!deck) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-zinc-950">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-teal-700"
          href="/"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          카탈로그
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <Surface className="overflow-hidden">
              <div className="border-b border-zinc-100 bg-zinc-950 p-6 text-white">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="teal">{deck.category}</Badge>
                      <Badge tone={deck.status === "최신" ? "teal" : "zinc"}>
                        {deck.status}
                      </Badge>
                      <Badge tone="zinc">v{deck.version}</Badge>
                    </div>
                    <h1 className="mt-3 text-3xl font-semibold leading-10">
                      {deck.title}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
                      {deck.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <RecommendButton
                      initialCount={deck.recommendations}
                      slug={deck.slug}
                    />
                    <ShareButton slug={deck.slug} />
                    <ReportButton slug={deck.slug} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-5 md:grid-cols-4">
                <StatCard label="카드" value={deck.cards.toLocaleString()} icon={FileArchive} />
                <StatCard label="다운로드" value={deck.downloads.toLocaleString()} icon={Download} />
                <StatCard label="품질" value={`${deck.qualityScore}점`} icon={ShieldCheck} />
                <StatCard label="댓글" value={deck.comments.length} icon={MessageSquare} />
              </div>
            </Surface>

            <Surface className="p-5">
              <SectionTitle
                title="샘플 카드"
                body="다운로드 전에 카드 스타일과 설명 방식을 먼저 확인합니다."
                icon={Sparkles}
              />

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {deck.sampleCards.map((card) => (
                  <article
                    className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                    key={card.front}
                  >
                    <p className="text-xs font-semibold text-teal-700">Front</p>
                    <p className="mt-1 text-base font-semibold text-zinc-950">
                      {card.front}
                    </p>
                    <p className="mt-4 text-xs font-semibold text-zinc-500">Back</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">
                      {card.back}
                    </p>
                  </article>
                ))}
              </div>
            </Surface>

            <Surface className="p-5">
              <SectionTitle
                title="버전 기록"
                body={`최신 버전은 v${deck.version}입니다. 파일은 덮어쓰지 않고 버전별로 보관합니다.`}
                icon={GitBranch}
              />

              <div className="mt-5 divide-y divide-zinc-100">
                {deck.versions.map((version) => (
                  <article
                    className="py-4 first:pt-0 last:pb-0"
                    key={version.version}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">v{version.version}</p>
                          <span className="text-sm text-zinc-500">
                            {version.fileSize}
                          </span>
                          <span className="text-sm text-zinc-500">
                            {version.publishedAt}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          {version.changelog}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 break-all text-xs text-zinc-400">
                          <Hash size={13} aria-hidden="true" />
                          {version.sha256}
                        </p>
                      </div>
                      <DownloadButton
                        versionId={`${deck.slug}:${version.version}`}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </Surface>

            <CommentThread comments={deck.comments} />
          </div>

          <aside className="space-y-5">
            <Surface className="p-5">
              <SectionTitle title="요약" icon={ShieldCheck} />
              <div className="mt-5">
                <InfoList
                  items={[
                    ["분류", deck.category],
                    ["자격 구분", deck.examTrack],
                    ["업데이트", deck.updatedAt],
                    ["검증일", deck.verifiedAt],
                    ["업로더", deck.uploader],
                    ["라이선스", deck.license],
                  ]}
                />
              </div>
            </Surface>

            <Surface className="p-5">
              <SectionTitle title="출처" icon={CalendarClock} />
              <a
                className="mt-4 block text-sm font-semibold leading-6 text-teal-700 hover:underline"
                href={deck.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {deck.sourceName}
              </a>
              <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm leading-6 text-zinc-500">
                공개 자료와 업로더 메모를 기준으로 검토한 덱입니다. 신고가 접수되면
                운영자 검수 대기열에서 다시 확인합니다.
              </p>
            </Surface>
          </aside>
        </div>
      </section>
    </main>
  );
}
