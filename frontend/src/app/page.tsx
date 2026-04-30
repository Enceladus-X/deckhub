import { AppHeader } from "@/components/app-header";
import { DeckCatalog } from "@/components/deck-catalog";
import { decks, providers } from "@/lib/deck-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-zinc-950">
      <AppHeader />
      <DeckCatalog decks={decks} providers={providers} />
    </main>
  );
}
