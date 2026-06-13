import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const decksRoot = path.join(repoRoot, "decks");
const outputTargets = [
  path.join(repoRoot, "catalog", "decks.json"),
  path.join(repoRoot, "frontend", "src", "generated", "catalog.json"),
];
const isCheck = process.argv.includes("--check");

const requiredRootFields = [
  "schemaVersion",
  "slug",
  "title",
  "summary",
  "category",
  "exam",
  "license",
  "maintainers",
  "versions",
];

const errors = [];
const warnings = [];

function main() {
  const manifests = findDeckManifests(decksRoot).map(readManifest);
  const decks = manifests.map(({ filePath, manifest }) => normalizeDeck(filePath, manifest));

  validateGlobalRules(decks);

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`error: ${error}`);
    }
    process.exit(1);
  }

  for (const warning of warnings) {
    console.warn(`warning: ${warning}`);
  }

  const catalog = buildCatalog(decks);
  const serialized = `${JSON.stringify(catalog, null, 2)}\n`;

  if (isCheck) {
    checkTargets(serialized);
    return;
  }

  for (const target of outputTargets) {
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, serialized, "utf8");
  }

  console.log(`Generated catalog with ${catalog.decks.length} deck(s).`);
}

function findDeckManifests(root) {
  if (!existsSync(root)) {
    return [];
  }

  const result = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "_schema") {
          continue;
        }
        stack.push(absolutePath);
      } else if (entry.isFile() && entry.name === "deck.json") {
        result.push(absolutePath);
      }
    }
  }

  return result.sort((left, right) => left.localeCompare(right));
}

function readManifest(filePath) {
  try {
    return {
      filePath,
      manifest: JSON.parse(readFileSync(filePath, "utf8")),
    };
  } catch (error) {
    errors.push(`${relative(filePath)} is not valid JSON: ${error.message}`);
    return { filePath, manifest: {} };
  }
}

function normalizeDeck(filePath, manifest) {
  const context = relative(filePath);
  const deck = structuredClone(manifest);

  for (const field of requiredRootFields) {
    if (deck[field] === undefined || deck[field] === null || deck[field] === "") {
      errors.push(`${context}: missing required field "${field}".`);
    }
  }

  if (deck.schemaVersion !== 1) {
    errors.push(`${context}: schemaVersion must be 1.`);
  }

  if (!isSlug(deck.slug)) {
    errors.push(`${context}: slug must use lowercase letters, numbers, and hyphens.`);
  }

  if (!isPlainObject(deck.exam) || !nonEmptyString(deck.exam.name)) {
    errors.push(`${context}: exam.name is required.`);
  }

  if (!Array.isArray(deck.maintainers) || deck.maintainers.length === 0) {
    errors.push(`${context}: maintainers must contain at least one GitHub handle or name.`);
  }

  if (!Array.isArray(deck.versions) || deck.versions.length === 0) {
    errors.push(`${context}: versions must contain at least one release.`);
  }

  const versions = Array.isArray(deck.versions)
    ? deck.versions.map((version, index) => normalizeVersion(context, deck.slug, version, index))
    : [];

  return {
    ...deck,
    manifestPath: relative(filePath),
    versions,
  };
}

function normalizeVersion(context, deckSlug, version, index) {
  const label = `${context}: versions[${index}]`;

  if (!isPlainObject(version)) {
    errors.push(`${label} must be an object.`);
    return {};
  }

  if (!nonEmptyString(version.version)) {
    errors.push(`${label}.version is required.`);
  }

  if (!isIsoDate(version.releasedAt)) {
    errors.push(`${label}.releasedAt must be YYYY-MM-DD.`);
  }

  validateStats(`${label}.stats`, version.stats);
  validateApkg(`${label}.apkg`, version.apkg);

  const segments = Array.isArray(version.segments) ? version.segments : [];
  if (version.segments !== undefined && !Array.isArray(version.segments)) {
    errors.push(`${label}.segments must be an array when provided.`);
  }

  const normalizedSegments = segments.map((segment, segmentIndex) =>
    normalizeSegment(`${label}.segments[${segmentIndex}]`, segment),
  );

  const segmentCardTotal = normalizedSegments.reduce(
    (total, segment) => total + Number(segment.cards || 0),
    0,
  );
  const deckCards = Number(version.stats?.cards || 0);
  if (segmentCardTotal > deckCards && deckCards > 0) {
    warnings.push(
      `${label}: segment card total (${segmentCardTotal}) is greater than version card count (${deckCards}).`,
    );
  }

  const noteTypes = Array.isArray(version.noteTypes) ? version.noteTypes : [];
  if (version.noteTypes !== undefined && !Array.isArray(version.noteTypes)) {
    errors.push(`${label}.noteTypes must be an array when provided.`);
  }

  return {
    ...version,
    id: `${deckSlug}@${version.version}`,
    segments: normalizedSegments,
    noteTypes,
  };
}

function normalizeSegment(label, segment) {
  if (!isPlainObject(segment)) {
    errors.push(`${label} must be an object.`);
    return {};
  }

  if (!isSlug(segment.id)) {
    errors.push(`${label}.id must use lowercase letters, numbers, and hyphens.`);
  }

  if (!nonEmptyString(segment.label)) {
    errors.push(`${label}.label is required.`);
  }

  if (!Number.isInteger(segment.cards) || segment.cards < 0) {
    errors.push(`${label}.cards must be a non-negative integer.`);
  }

  if (segment.apkg !== undefined) {
    validateApkg(`${label}.apkg`, segment.apkg);
  }

  return segment;
}

function validateStats(label, stats) {
  if (!isPlainObject(stats)) {
    errors.push(`${label} is required.`);
    return;
  }

  for (const field of ["cards", "notes", "media"]) {
    if (!Number.isInteger(stats[field]) || stats[field] < 0) {
      errors.push(`${label}.${field} must be a non-negative integer.`);
    }
  }
}

function validateApkg(label, apkg) {
  if (!isPlainObject(apkg)) {
    errors.push(`${label} is required.`);
    return;
  }

  if (!nonEmptyString(apkg.assetName) || !apkg.assetName.endsWith(".apkg")) {
    errors.push(`${label}.assetName must end with .apkg.`);
  }

  if (!isUrl(apkg.downloadUrl)) {
    errors.push(`${label}.downloadUrl must be a valid URL.`);
  }

  if (!/^[a-f0-9]{64}$/i.test(apkg.sha256 || "")) {
    errors.push(`${label}.sha256 must be a 64-character SHA256 hex digest.`);
  }

  if (!Number.isInteger(apkg.sizeBytes) || apkg.sizeBytes <= 0) {
    errors.push(`${label}.sizeBytes must be a positive integer.`);
  }
}

function validateGlobalRules(decks) {
  const slugs = new Map();
  const versionIds = new Map();
  const sha256s = new Map();

  for (const deck of decks) {
    addUnique(slugs, deck.slug, deck.manifestPath, "slug");

    for (const version of deck.versions || []) {
      addUnique(versionIds, version.id, deck.manifestPath, "version id");
      collectSha(sha256s, version.apkg?.sha256, `${deck.slug} ${version.version}`);

      for (const segment of version.segments || []) {
        collectSha(sha256s, segment.apkg?.sha256, `${deck.slug} ${version.version} ${segment.id}`);
      }
    }
  }
}

function addUnique(map, key, owner, label) {
  if (!key) {
    return;
  }
  if (map.has(key)) {
    errors.push(`duplicate ${label} "${key}" in ${owner} and ${map.get(key)}.`);
    return;
  }
  map.set(key, owner);
}

function collectSha(map, sha, owner) {
  if (!sha) {
    return;
  }
  const normalized = sha.toLowerCase();
  if (map.has(normalized)) {
    errors.push(`duplicate APKG sha256 "${normalized}" in ${owner} and ${map.get(normalized)}.`);
    return;
  }
  map.set(normalized, owner);
}

function buildCatalog(decks) {
  const sortedDecks = decks
    .map((deck) => ({
      ...deck,
      versions: [...deck.versions].sort((left, right) =>
        right.releasedAt.localeCompare(left.releasedAt),
      ),
    }))
    .sort((left, right) => {
      const latestLeft = left.versions[0]?.releasedAt || "";
      const latestRight = right.versions[0]?.releasedAt || "";
      return latestRight.localeCompare(latestLeft) || left.title.localeCompare(right.title);
    });

  const totalCards = sortedDecks.reduce(
    (total, deck) => total + Number(deck.versions[0]?.stats?.cards || 0),
    0,
  );
  const totalSegments = sortedDecks.reduce(
    (total, deck) => total + Number(deck.versions[0]?.segments?.length || 0),
    0,
  );
  const categories = [...new Set(sortedDecks.map((deck) => deck.category))].sort((left, right) =>
    left.localeCompare(right),
  );

  return {
    schemaVersion: 1,
    generatedBy: "scripts/build-catalog.mjs",
    checksum: createHash("sha256")
      .update(JSON.stringify(sortedDecks))
      .digest("hex")
      .slice(0, 16),
    summary: {
      decks: sortedDecks.length,
      latestVersions: sortedDecks.length,
      cards: totalCards,
      segments: totalSegments,
      categories,
    },
    decks: sortedDecks,
  };
}

function checkTargets(serialized) {
  let hasMismatch = false;

  for (const target of outputTargets) {
    if (!existsSync(target)) {
      console.error(`error: ${relative(target)} does not exist. Run npm run catalog:build.`);
      hasMismatch = true;
      continue;
    }

    const current = readFileSync(target, "utf8");
    if (current !== serialized) {
      console.error(`error: ${relative(target)} is out of date. Run npm run catalog:build.`);
      hasMismatch = true;
    }
  }

  if (hasMismatch) {
    process.exit(1);
  }

  console.log("Catalog is up to date.");
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSlug(value) {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isUrl(value) {
  if (!nonEmptyString(value)) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

main();
