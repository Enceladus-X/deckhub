import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repo = "Enceladus-X/deckhub";
const options = parseArgs(process.argv.slice(2));

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
      segments: buildSegments(options.segments),
      noteTypes: [],
    },
  ],
};

mkdirSync(deckDir, { recursive: true });
writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Linked ${asset.name}`);
console.log(`Wrote ${path.relative(process.cwd(), target)}`);
console.log("Next: npm run catalog:build && npm run catalog:check");

function parseArgs(args) {
  const parsed = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith("--")) {
      fail(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    if (key === "force") {
      parsed.force = true;
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
    const id = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return {
      id: id || `segment-${index + 1}`,
      label,
      cards: 0,
    };
  });
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

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}
