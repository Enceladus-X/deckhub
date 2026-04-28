import {
  CalendarClock,
  Download,
  FileArchive,
  GitBranch,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const decks = [
    {
      title: "AWS Solutions Architect Associate",
      code: "SAA-C03",
      version: "2026.04",
      cards: "486",
      downloads: "1,248",
      status: "Latest",
      color: "border-teal-500",
    },
    {
      title: "AWS SysOps Administrator Associate",
      code: "SOA-C03",
      version: "2026.03",
      cards: "392",
      downloads: "734",
      status: "Stable",
      color: "border-amber-500",
    },
    {
      title: "Google Cloud Associate Cloud Engineer",
      code: "ACE",
      version: "2026.02",
      cards: "318",
      downloads: "519",
      status: "Reviewing",
      color: "border-sky-500",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white">
              <FileArchive size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-semibold leading-7">DeckHub</p>
              <p className="text-sm text-zinc-500">
                Certification Deck Hub for Anki
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-600 sm:flex">
            <ShieldCheck size={16} className="text-teal-600" aria-hidden="true" />
            Signed CDN downloads
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
              placeholder="Search certification"
            />
          </div>
          <div className="mt-5 space-y-2">
            {["AWS", "Google Cloud", "Security", "Linux"].map((item) => (
              <button
                className="flex h-10 w-full items-center justify-between rounded-md px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                key={item}
                type="button"
              >
                <span>{item}</span>
                <span className="text-xs text-zinc-400">0{item.length}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-5">
          <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold leading-8">
                Certification Decks
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Immutable versions, SHA256-backed files, CDN delivery.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Decks", "3"],
                ["Cards", "1,196"],
                ["Downloads", "2,501"],
              ].map(([label, value]) => (
                <div
                  className="min-w-20 rounded-md border border-zinc-200 px-3 py-2"
                  key={label}
                >
                  <p className="text-base font-semibold">{value}</p>
                  <p className="text-xs text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {decks.map((deck) => (
              <article
                className={`rounded-lg border border-l-4 ${deck.color} bg-white p-5 shadow-sm`}
                key={deck.code}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold leading-7">
                        {deck.title}
                      </h2>
                      <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                        {deck.code}
                      </span>
                      <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                        {deck.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <GitBranch size={15} aria-hidden="true" />
                        v{deck.version}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FileArchive size={15} aria-hidden="true" />
                        {deck.cards} cards
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarClock size={15} aria-hidden="true" />
                        {deck.downloads} downloads
                      </span>
                    </div>
                  </div>
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                    type="button"
                  >
                    <Download size={17} aria-hidden="true" />
                    Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
