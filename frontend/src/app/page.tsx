import {
  BookOpenCheck,
  Boxes,
  CheckCircle2,
  FileArchive,
  GitPullRequestArrow,
  Github,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
              <p className="text-xs text-zinc-500">GitHub-native Anki archive</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a
              className="hidden h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:inline-flex"
              href="https://github.com/Enceladus-X/deckhub"
            >
              <Github aria-hidden="true" size={17} />
              GitHub
            </a>
            <a
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              href="https://github.com/Enceladus-X/deckhub/issues/new?template=deck_submission.yml"
            >
              <GitPullRequestArrow aria-hidden="true" size={17} />
              제출
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
                Repository as Archive
              </div>
              <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                Anki 덱을 GitHub 릴리즈와 manifest로 검증해서 공유합니다.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                APKG는 Release 자산으로 보관하고, `decks/`의 작은 JSON manifest가 검색,
                버전, SHA256, 세부 범위 정보를 담당합니다. 서버 없이 시작하고 필요해질 때
                CDN/API를 붙일 수 있습니다.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <a
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-teal-100"
                  href="https://github.com/Enceladus-X/deckhub/releases"
                >
                  <FileArchive aria-hidden="true" size={17} />
                  Releases
                </a>
                <a
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  href="https://github.com/Enceladus-X/deckhub/tree/main/decks"
                >
                  <BookOpenCheck aria-hidden="true" size={17} />
                  Manifest
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
              title: "Release에 APKG 저장",
              body: "대용량 파일은 Git 히스토리에 넣지 않고 Release asset으로 관리합니다.",
            },
            {
              icon: ShieldCheck,
              title: "SHA256 중복 방지",
              body: "동일 APKG 해시가 manifest에 다시 들어오면 CI가 막습니다.",
            },
            {
              icon: Boxes,
              title: "세부 범위 분할",
              body: "같은 덱 안에서도 1급, Part 2, 초급처럼 필요한 단위만 받을 수 있습니다.",
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
                Contributor Flow
              </p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                덱 제출은 게시판보다 GitHub PR에 가깝게
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                사용자는 Issue로 덱을 제안하거나 PR로 manifest를 추가합니다. 검증이 통과하면
                Pages 카탈로그와 README가 같은 데이터에서 갱신됩니다.
              </p>
            </div>
            <a
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
              href="https://github.com/Enceladus-X/deckhub/actions/workflows/catalog.yml"
            >
              <CheckCircle2 aria-hidden="true" size={17} />
              검증 상태
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
