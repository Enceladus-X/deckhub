import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const [categoryArg, slugArg] = process.argv.slice(2);

if (!categoryArg || !slugArg) {
  console.error("Usage: npm run deck:new -- <category> <slug>");
  console.error("Example: npm run deck:new -- language hsk-vocabulary");
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(categoryArg)) {
  console.error("Category must use lowercase letters, numbers, and hyphens.");
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugArg)) {
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
    title: "덱 제목",
    summary: "무엇을 공부하기 위한 덱인지 한 문장으로 적어주세요.",
    category,
    kind: "vocabulary",
    exam: {
      name: "시험명",
      provider: "시행 기관",
      scope: ["예: 1급", "예: Part 1", "예: 전체 범위"],
    },
    language: "ko",
    license: "CC BY-NC-SA 4.0",
    maintainers: ["@github-id"],
    links: [
      {
        label: "공식 범위",
        url: "https://example.com",
      },
    ],
    versions: [
      {
        version: "2026.06",
        releasedAt: "2026-06-13",
        changes: "첫 공개 버전",
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
