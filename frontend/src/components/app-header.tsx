import Link from "next/link";
import { FileArchive, Search, ShieldCheck, UploadCloud } from "lucide-react";

type AppHeaderProps = {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
};

export function AppHeader({ onSearchChange, searchValue = "" }: AppHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white">
            <FileArchive size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl font-semibold leading-7">DeckHub</p>
            <p className="text-sm text-zinc-500">
              Q-Net 자격시험 Anki 아카이브
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {onSearchChange ? (
            <div className="relative sm:w-72 lg:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                className="h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="과목 검색"
                value={searchValue}
              />
            </div>
          ) : null}
          <div className="hidden items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-600 md:flex">
            <ShieldCheck size={16} className="text-teal-600" aria-hidden="true" />
            Signed CDN
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition hover:border-teal-500 hover:text-teal-700"
            href="/admin/"
          >
            검수
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
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
