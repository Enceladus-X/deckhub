import Link from "next/link";
import {
  FileArchive,
  Palette,
  Search,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

type AppHeaderProps = {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
};

export function AppHeader({ onSearchChange, searchValue = "" }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-sm">
              <FileArchive size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-semibold leading-7">DeckHub</p>
              <p className="text-sm text-zinc-500">
                자격시험 Anki 덱 공유 아카이브
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-1 text-sm font-semibold text-zinc-600 sm:ml-4">
            <Link
              className="rounded-md px-3 py-2 transition-all duration-200 hover:bg-zinc-100 hover:text-teal-700"
              href="/"
            >
              탐색
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 transition-all duration-200 hover:bg-zinc-100 hover:text-teal-700"
              href="/templates/"
            >
              <Palette size={15} aria-hidden="true" />
              템플릿
            </Link>
            <Link
              className="rounded-md px-3 py-2 transition-all duration-200 hover:bg-zinc-100 hover:text-teal-700"
              href="/admin/"
            >
              검수
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {onSearchChange ? (
            <div className="relative sm:w-72 lg:w-96">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:border-teal-600 focus:bg-white focus:shadow-sm"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="과목, 분야, 설명 검색"
                value={searchValue}
              />
            </div>
          ) : null}
          <div className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 md:flex">
            <ShieldCheck size={16} className="text-teal-600" aria-hidden="true" />
            Signed CDN
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-700 hover:shadow-sm"
            href="/upload/"
          >
            <UploadCloud size={17} aria-hidden="true" />
            업로드
          </Link>
        </div>
      </div>
    </header>
  );
}
