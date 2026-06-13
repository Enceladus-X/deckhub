import catalogJson from "@/generated/catalog.json";

export type ApkgAsset = {
  assetName: string;
  downloadUrl: string;
  sha256: string;
  sizeBytes: number;
};

export type DeckSegment = {
  id: string;
  label: string;
  description?: string;
  scope?: string[];
  cards: number;
  apkg?: ApkgAsset;
};

export type NoteTypeSummary = {
  name: string;
  fields: string[];
  templates?: Array<Record<string, unknown>>;
};

export type DeckVersion = {
  id: string;
  version: string;
  releasedAt: string;
  changes?: string;
  stats: {
    cards: number;
    notes: number;
    media: number;
  };
  apkg: ApkgAsset;
  segments: DeckSegment[];
  noteTypes: NoteTypeSummary[];
};

export type DeckManifest = {
  schemaVersion: 1;
  slug: string;
  title: string;
  summary: string;
  category: string;
  kind?: string;
  exam: {
    name: string;
    provider?: string;
    scope?: string[];
  };
  language?: string;
  license: string;
  maintainers: string[];
  links?: Array<{
    label: string;
    url: string;
  }>;
  manifestPath: string;
  versions: DeckVersion[];
};

export type DeckCatalog = {
  schemaVersion: 1;
  generatedBy: string;
  checksum: string;
  summary: {
    decks: number;
    latestVersions: number;
    cards: number;
    segments: number;
    categories: string[];
  };
  decks: DeckManifest[];
};

export const deckCatalog = catalogJson as DeckCatalog;

export function getLatestVersion(deck: DeckManifest) {
  return deck.versions[0];
}

export function findDeckBySlug(slug: string) {
  return deckCatalog.decks.find((deck) => deck.slug === slug);
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function formatBytes(value: number) {
  if (value < 1024 * 1024) {
    return `${Math.max(1, Math.round(value / 1024)).toLocaleString("ko-KR")} KB`;
  }

  return `${(value / 1024 / 1024).toLocaleString("ko-KR", {
    maximumFractionDigits: 1,
  })} MB`;
}

export function releaseLabel(version?: DeckVersion) {
  if (!version) {
    return "등록 대기";
  }

  return `${version.version} · ${version.releasedAt}`;
}
