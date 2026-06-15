import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repo = "Enceladus-X/deckhub";
const options = parseArgs(process.argv.slice(2));
if (options["deck-version"] && !options.version) {
  options.version = options["deck-version"];
}
const analysis = options["analysis-json"] ? readAnalysis(options["analysis-json"]) : undefined;

if (analysis) {
  if (analysis.cards !== undefined) {
    options.cards ??= String(analysis.cards);
  }
  if (analysis.notes !== undefined) {
    options.notes ??= String(analysis.notes);
  }
  if (analysis.media !== undefined) {
    options.media ??= String(analysis.media);
  }
}

const required = [
  "category",
  "slug",
  "title",
  "summary",
  "exam",
  "version",
  "release",
  "asset",
  "sha256",
  "cards",
  "notes",
];

for (const key of required) {
  if (!options[key]) {
    fail(`Missing --${key}`);
  }
}

if (!isSlug(options.category)) {
  fail("--category must use lowercase letters, numbers, and hyphens.");
}

if (!isSlug(options.slug)) {
  fail("--slug must use lowercase letters, numbers, and hyphens.");
}

if (!/^[a-f0-9]{64}$/i.test(options.sha256)) {
  fail("--sha256 must be a 64-character SHA256 hex digest.");
}

const cards = toNonNegativeInteger(options.cards, "--cards");
const notes = toNonNegativeInteger(options.notes, "--notes");
const media = toNonNegativeInteger(options.media ?? "0", "--media");
const release = readRelease(options.release);
const asset = release.assets.find((item) => item.name === options.asset);

if (!asset) {
  const names = release.assets.map((item) => item.name).join(", ") || "none";
  fail(`Release ${options.release} does not contain asset "${options.asset}". Assets: ${names}`);
}

if (!asset.name.endsWith(".apkg")) {
  fail("Release asset must end with .apkg.");
}

const sizeBytes = toNonNegativeInteger(String(asset.size || options.size || 0), "asset size");

if (sizeBytes <= 0) {
  fail("Could not read a positive asset size from the release. Pass --size <bytes>.");
}

const category = options.category;
const slug = options.slug;
const deckDir = path.join(process.cwd(), "decks", category, slug);
const target = path.join(deckDir, "deck.json");

if (existsSync(target) && !options.force) {
  fail(`${path.relative(process.cwd(), target)} already exists. Pass --force to overwrite.`);
}

const scope = splitCsv(options.scope);
const links = options.source
  ? [
      {
        label: "Source",
        url: options.source,
      },
    ]
  : [];
const shouldBuildTagSegments =
  (options["segments-from-tags"] || (!options.segments && hasEntries(analysis?.tagCounts))) &&
  Boolean(analysis);

const manifest = {
  "$schema": "../../_schema/deck.schema.json",
  schemaVersion: 1,
  slug,
  title: options.title,
  summary: options.summary,
  category,
  kind: options.kind || "deck",
  exam: {
    name: options.exam,
    ...(options.provider ? { provider: options.provider } : {}),
    ...(scope.length > 0 ? { scope } : {}),
  },
  language: options.language || "ko",
  license: options.license || "CC BY-NC-SA 4.0",
  maintainers: splitCsv(options.maintainers || "@Enceladus-X"),
  links,
  versions: [
    {
      version: options.version,
      releasedAt: (release.publishedAt || new Date().toISOString()).slice(0, 10),
      changes: options.changes || "Initial public release",
      stats: {
        cards,
        notes,
        media,
      },
      apkg: {
        assetName: asset.name,
        downloadUrl: releaseDownloadUrl(options.release, asset.name),
        sha256: options.sha256.toLowerCase(),
        sizeBytes,
      },
      segments: shouldBuildTagSegments
        ? buildSegmentsFromTagCounts(analysis?.tagCounts)
        : buildSegments(options.segments),
      noteTypes: buildNoteTypes(analysis?.noteTypes),
    },
  ],
};

mkdirSync(deckDir, { recursive: true });
writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Linked ${asset.name}`);
console.log(`Wrote ${path.relative(process.cwd(), target)}`);
console.log("Next: npm run catalog:build && npm run catalog:check");

function parseArgs(args) {
  if (args[0] && !args[0].startsWith("--")) {
    return parsePositionalArgs(args);
  }

  const parsed = {};
  const booleanFlags = new Set(["force", "segments-from-tags"]);

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith("--")) {
      fail(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    if (booleanFlags.has(key)) {
      parsed[key] = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      fail(`Missing value for --${key}`);
    }

    parsed[key] = value;
    index += 1;
  }

  return parsed;
}

function parsePositionalArgs(args) {
  const keys = [
    "category",
    "slug",
    "title",
    "summary",
    "exam",
    "version",
    "release",
    "asset",
    "sha256",
    "analysis-json",
  ];

  if (args.length < 9) {
    fail(
      "Positional mode requires: category slug title summary exam version release asset sha256 [analysis-json]",
    );
  }

  const parsed = {};
  keys.forEach((key, index) => {
    if (args[index]) {
      parsed[key] = args[index];
    }
  });

  return parsed;
}

function readAnalysis(filePath) {
  try {
    const analysis = JSON.parse(readFileSync(path.resolve(filePath), "utf8"));
    if (!isPlainObject(analysis)) {
      fail("--analysis-json must point to a JSON object.");
    }
    return analysis;
  } catch (error) {
    fail(`Could not read --analysis-json ${filePath}: ${error.message}`);
  }
}

function readRelease(tag) {
  try {
    const output = execFileSync(
      "gh",
      ["release", "view", tag, "--repo", repo, "--json", "assets,publishedAt,tagName"],
      { encoding: "utf8" },
    );
    return JSON.parse(output);
  } catch (error) {
    fail(
      `Could not read release "${tag}". Create it first and attach the APKG asset. ${error.message}`,
    );
  }
}

function releaseDownloadUrl(tag, assetName) {
  const safeTag = encodeURIComponent(tag);
  const safeAsset = encodeURIComponent(assetName);
  return `https://github.com/${repo}/releases/download/${safeTag}/${safeAsset}`;
}

function buildSegments(value) {
  return splitCsv(value).map((label, index) => {
    return {
      id: toSlug(label) || `segment-${index + 1}`,
      label,
      cards: 0,
    };
  });
}

function buildSegmentsFromTagCounts(tagCounts) {
  if (!isPlainObject(tagCounts) || Object.keys(tagCounts).length === 0) {
    fail("--segments-from-tags requires --analysis-json with a non-empty tagCounts object.");
  }

  return Object.entries(tagCounts)
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([label, cards], index) => ({
      id: toSlug(label) || `segment-${index + 1}`,
      label,
      scope: [label],
      cards: toNonNegativeInteger(String(cards), `tagCounts.${label}`),
    }));
}

function buildNoteTypes(noteTypes) {
  if (!Array.isArray(noteTypes)) {
    return [];
  }

  return noteTypes
    .filter((noteType) => isPlainObject(noteType) && nonEmptyString(noteType.name))
    .map((noteType) => ({
      name: noteType.name,
      fields: Array.isArray(noteType.fields) ? noteType.fields.filter(nonEmptyString) : [],
      templates: Array.isArray(noteType.templates)
        ? noteType.templates.filter(nonEmptyString).map((name) => ({ name }))
        : [],
      ...(Number.isInteger(noteType.notes) ? { notes: noteType.notes } : {}),
      ...(Number.isInteger(noteType.cards) ? { cards: noteType.cards } : {}),
    }));
}

function splitCsv(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNonNegativeInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    fail(`${label} must be a non-negative integer.`);
  }
  return number;
}

function isSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function toSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasEntries(value) {
  return isPlainObject(value) && Object.keys(value).length > 0;
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}
