import { AppHeader } from "@/components/app-header";
import { DeckCatalog } from "@/components/deck-catalog";
import { categories, decks } from "@/lib/deck-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-zinc-950">
      <AppHeader />
      <DeckCatalog categories={categories} decks={decks} />
    </main>
  );
}
