import {
  BookOpenCheck,
  Boxes,
  CheckCircle2,
  FileArchive,
  Github,
  Rocket,
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
              <p className="text-xs text-zinc-500">Maintainer-curated Anki archive</p>
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
              href="https://github.com/Enceladus-X/deckhub/releases"
            >
              <Rocket aria-hidden="true" size={17} />
              Releases
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
                Owner Managed
              </div>
              <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                Curated Anki decks, published directly from this repository.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                DeckHub does not accept external deck submissions yet. APKG files are
                attached to GitHub Releases, and small JSON manifests describe search metadata,
                versions, SHA256 hashes, and optional split download ranges.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <a
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-teal-100"
                  href="https://github.com/Enceladus-X/deckhub/releases"
                >
                  <FileArchive aria-hidden="true" size={17} />
                  Browse Releases
                </a>
                <a
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  href="https://github.com/Enceladus-X/deckhub/blob/main/docs/publish-deck.md"
                >
                  <BookOpenCheck aria-hidden="true" size={17} />
                  Publish Guide
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-zinc-200 lg:grid-cols-1">
              {[
                ["Decks", formatCount(summary.decks)],
                ["Cards", formatCount(summary.cards)],
                ["Split files", formatCount(summary.segments)],
                ["Categories", formatCount(summary.categories.length)],
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
              title: "Release assets",
              body: "Large APKG files stay out of Git history and live as GitHub Release assets.",
            },
            {
              icon: ShieldCheck,
              title: "SHA256 guardrail",
              body: "The catalog workflow blocks duplicate APKG hashes and malformed manifests.",
            },
            {
              icon: Boxes,
              title: "Split ranges",
              body: "A single deck can expose smaller ranges such as Level 1, Part 2, or full scope.",
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
                Update decks with one release and one manifest diff.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                Export an APKG, attach it to a GitHub Release, update the manifest, and let
                Actions rebuild the static catalog. Visitors only see a clean download page.
              </p>
            </div>
            <a
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
              href="https://github.com/Enceladus-X/deckhub/actions/workflows/catalog.yml"
            >
              <CheckCircle2 aria-hidden="true" size={17} />
              Workflow
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
