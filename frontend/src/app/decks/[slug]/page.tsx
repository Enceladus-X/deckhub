import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarClock,
  Download,
  FileArchive,
  GitBranch,
  Hash,
  MessageSquare,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { CommentThread } from "@/components/comment-thread";
import { RecommendButton } from "@/components/recommend-button";
import { ShareButton } from "@/components/share-button";
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
    <main className="min-h-screen bg-[#f7f8fb] text-zinc-950">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <Link
          className="text-sm font-medium text-zinc-500 transition hover:text-teal-700"
          href="/"
        >
          Catalog
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <section
              className={`rounded-lg border border-l-4 ${deck.accent} bg-white p-5`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold leading-8">
                      {deck.title}
                    </h1>
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                      {deck.code}
                    </span>
                    <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                      {deck.status}
                    </span>
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                    {deck.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {deck.tags.map((tag) => (
                      <span
                        className="rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-500"
                        key={tag}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <RecommendButton initialCount={deck.recommendations} />
                  <ShareButton slug={deck.slug} />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold leading-7">버전</h2>
                  <p className="text-sm text-zinc-500">
                    최신 버전: v{deck.version}
                  </p>
                </div>
                <GitBranch size={20} className="text-zinc-500" aria-hidden="true" />
              </div>

              <div className="mt-5 divide-y divide-zinc-100">
                {deck.versions.map((version) => (
                  <article className="py-4 first:pt-0 last:pb-0" key={version.version}>
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
                      <button
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                        type="button"
                      >
                        <Download size={16} aria-hidden="true" />
                        Download
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <CommentThread comments={deck.comments} />
          </div>

          <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold leading-7">요약</h2>
            <div className="mt-4 divide-y divide-zinc-100">
              {[
                [FileArchive, "Cards", deck.cards.toLocaleString()],
                [Download, "Downloads", deck.downloads.toLocaleString()],
                [MessageSquare, "Comments", deck.comments.length.toString()],
                [CalendarClock, "Track", deck.examTrack],
              ].map(([Icon, label, value]) => (
                <div className="flex items-center justify-between gap-4 py-3" key={label as string}>
                  <span className="flex items-center gap-2 text-sm text-zinc-500">
                    <Icon size={15} aria-hidden="true" />
                    {label as string}
                  </span>
                  <span className="text-right text-sm font-semibold text-zinc-800">
                    {value as string}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
