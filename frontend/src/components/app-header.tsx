import Link from "next/link";
import { ExternalLink, FileArchive, Palette } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white shadow-sm">
            <FileArchive size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-6">DeckHub</p>
            <p className="text-xs text-zinc-500">Maintainer-curated Anki archive</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link
            className="hidden rounded-md px-3 py-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-teal-700 sm:inline-flex"
            href="/templates/"
          >
            <Palette size={15} aria-hidden="true" />
            Templates
          </Link>
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-white transition hover:bg-teal-700"
            href="https://github.com/Enceladus-X/deckhub/releases"
          >
            Releases
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
