import {
  BookOpenCheck,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  FileArchive,
  Github,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { CatalogBrowser } from "@/components/catalog-browser";
import { deckCatalog, formatCount } from "@/lib/catalog";

export default function Home() {
  const { summary } = deckCatalog;

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-zinc-950">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white shadow-sm">
              <FileArchive size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-6">DeckHub</p>
              <p className="text-xs text-zinc-500">Anki 덱 공개 아카이브</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
              href="/preflight/"
            >
              <ClipboardCheck aria-hidden="true" size={17} />
              검수 도구
            </Link>
            <a
              className="hidden h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:inline-flex"
              href="https://github.com/Enceladus-X/deckhub"
            >
              <Github aria-hidden="true" size={17} />
              GitHub
            </a>
            <a
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              href="https://github.com/Enceladus-X/deckhub/releases"
            >
              <Rocket aria-hidden="true" size={17} />
              APKG 파일
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-6 sm:py-8">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="bg-zinc-950 p-6 text-white sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-teal-200">
                <Sparkles aria-hidden="true" size={14} />
                Curated Archive
              </div>
              <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                직접 만든 Anki 덱을 찾아보고 APKG로 내려받습니다.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                DeckHub는 공개 업로드 플랫폼이 아니라 관리자가 직접 만든 덱만 올리는
                아카이브입니다. 덱 파일은 GitHub Releases에 보관되고, 이 페이지는 manifest를
                읽어 최신 버전과 다운로드 링크를 보여줍니다.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <a
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-teal-100"
                  href="https://github.com/Enceladus-X/deckhub/releases"
                >
                  <FileArchive aria-hidden="true" size={17} />
                  APKG 파일 보기
                </a>
                <Link
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-500 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-teal-300"
                  href="/preflight/"
                >
                  <ClipboardCheck aria-hidden="true" size={17} />
                  TXT 검수
                </Link>
                <a
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  href="https://github.com/Enceladus-X/deckhub/blob/main/docs/publish-deck.md"
                >
                  <BookOpenCheck aria-hidden="true" size={17} />
                  발행 가이드
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-zinc-200 lg:grid-cols-1">
              {[
                ["덱", formatCount(summary.decks)],
                ["카드", formatCount(summary.cards)],
                ["분할 파일", formatCount(summary.segments)],
                ["분류", formatCount(summary.categories.length)],
              ].map(([label, value]) => (
                <div className="bg-white p-5" key={label}>
                  <p className="text-sm font-medium text-zinc-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-zinc-950">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: FileArchive,
              title: "Release 파일 연결",
              body: "APKG는 GitHub Release 자산으로 보관하고 페이지의 다운로드 버튼과 연결합니다.",
            },
            {
              icon: ShieldCheck,
              title: "SHA256 검증",
              body: "카탈로그 workflow가 중복 해시와 잘못된 manifest를 막습니다.",
            },
            {
              icon: Boxes,
              title: "세부 범위 분할",
              body: "하나의 덱 안에서도 급수, 파트, 단원 같은 작은 다운로드 단위를 표시할 수 있습니다.",
            },
          ].map((item) => (
            <article className="rounded-lg border border-zinc-200 bg-white p-4" key={item.title}>
              <item.icon aria-hidden="true" className="text-teal-700" size={20} />
              <h2 className="mt-3 text-sm font-semibold text-zinc-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-5">
          <CatalogBrowser decks={deckCatalog.decks} categories={summary.categories} />
        </div>

        <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-teal-700">
                Publish Flow
              </p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                Release와 manifest가 합쳐지면 페이지에 바로 반영됩니다.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                APKG를 Release에 올리고 `decks/` manifest를 추가하면 Actions가 카탈로그를
                다시 만들고 GitHub Pages를 배포합니다.
              </p>
            </div>
            <a
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
              href="https://github.com/Enceladus-X/deckhub/actions/workflows/catalog.yml"
            >
              <CheckCircle2 aria-hidden="true" size={17} />
              배포 상태
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
