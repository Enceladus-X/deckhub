import Link from "next/link";
import { FileArchive, ShieldCheck, UploadCloud } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
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
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-600 md:flex">
            <ShieldCheck size={16} className="text-teal-600" aria-hidden="true" />
            Signed CDN
          </div>
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
