"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { DeckCatalog } from "@/components/deck-catalog";
import { categories, decks } from "@/lib/deck-data";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-zinc-950">
      <AppHeader onSearchChange={setQuery} searchValue={query} />
      <DeckCatalog categories={categories} decks={decks} query={query} />
    </main>
  );
}
