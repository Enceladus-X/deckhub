import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const [categoryArg, slugArg] = process.argv.slice(2);

if (!categoryArg || !slugArg) {
  console.error("Usage: npm run deck:new -- <category> <slug>");
  console.error("Example: npm run deck:new -- language hsk-vocabulary");
  process.exit(1);
}

if (!isSlug(categoryArg)) {
  console.error("Category must use lowercase letters, numbers, and hyphens.");
  process.exit(1);
}

if (!isSlug(slugArg)) {
  console.error("Slug must use lowercase letters, numbers, and hyphens.");
  process.exit(1);
}

const deckDir = path.join(process.cwd(), "decks", categoryArg, slugArg);
const target = path.join(deckDir, "deck.json");

if (existsSync(target)) {
  console.error(`${target} already exists.`);
  process.exit(1);
}

mkdirSync(deckDir, { recursive: true });
writeFileSync(
  target,
  `${JSON.stringify(buildTemplate(categoryArg, slugArg), null, 2)}\n`,
  "utf8",
);

console.log(`Created ${path.relative(process.cwd(), target)}`);

function buildTemplate(category, slug) {
  return {
    "$schema": "../../_schema/deck.schema.json",
    schemaVersion: 1,
    slug,
    title: "Deck title",
    summary: "Describe what this Anki deck helps people study.",
    category,
    kind: "vocabulary",
    exam: {
      name: "Exam or subject",
      provider: "Provider",
      scope: ["Full scope"],
    },
    language: "ko",
    license: "CC BY-NC-SA 4.0",
    maintainers: ["@Enceladus-X"],
    links: [],
    versions: [
      {
        version: "2026.06",
        releasedAt: "2026-06-13",
        changes: "Initial public release",
        stats: {
          cards: 0,
          notes: 0,
          media: 0,
        },
        apkg: {
          assetName: "deck.apkg",
          downloadUrl:
            "https://github.com/Enceladus-X/deckhub/releases/download/<tag>/deck.apkg",
          sha256: "replace-with-64-character-sha256-hex-digest",
          sizeBytes: 1,
        },
        segments: [],
        noteTypes: [],
      },
    ],
  };
}

function isSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
