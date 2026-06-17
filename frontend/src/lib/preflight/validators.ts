import type {
  DeckProfile,
  IssueSeverity,
  IssueType,
  ParsedCard,
  PreflightIssue,
  PreflightReport,
  ReviewReason,
} from "./types";

const issueMeta: Record<
  IssueType,
  { severity: IssueSeverity; title: string; detail: string }
> = {
  field_broken: {
    severity: "error",
    title: "필드 개수 오류",
    detail: "세미콜론 필드 개수가 덱 기준과 맞지 않습니다.",
  },
  choice_dependent: {
    severity: "error",
    title: "보기 의존 표현",
    detail: "선택지가 없으면 질문 축이 성립하지 않는 표현이 포함되어 있습니다.",
  },
  negative_trace: {
    severity: "warning",
    title: "부정형 객관식 흔적",
    detail: "오답 하나만 남기는 카드인지 확인해야 합니다.",
  },
  incomplete_ox_statement: {
    severity: "error",
    title: "OX 문장 미완성",
    detail: "앞면이 완결된 참거짓 명제가 아닐 가능성이 큽니다.",
  },
  long_front: {
    severity: "warning",
    title: "앞면 과다",
    detail: "문제가 길어 한 번에 회상하기 어렵습니다.",
  },
  long_ox_front: {
    severity: "warning",
    title: "OX 앞면 과다",
    detail: "OX 문장이 너무 길어 핵심 기준이 흐려질 수 있습니다.",
  },
  long_back: {
    severity: "warning",
    title: "뒷면 과다",
    detail: "정답이 길어 분할, OX 전환, 문제-정답 역전을 검토해야 합니다.",
  },
  heavy_list: {
    severity: "warning",
    title: "긴 목록 정답",
    detail: "정답 목록이 많아 학습 강도가 높습니다.",
  },
  numeric_no_unit: {
    severity: "warning",
    title: "수치 단독 정답",
    detail: "수치 정답에 단위나 공식이 빠져 있을 수 있습니다.",
  },
  count_mismatch: {
    severity: "error",
    title: "요구 개수와 정답 개수 불일치",
    detail: "앞면의 n가지와 뒷면 목록 개수가 맞지 않습니다.",
  },
  vague_front: {
    severity: "warning",
    title: "질문 축 모호",
    detail: "무엇의 사항, 내용, 방법인지 앞면만 보고 분명하지 않을 수 있습니다.",
  },
  weak_axis: {
    severity: "info",
    title: "회상 축 약함",
    detail: "앞면이 짧거나 범위가 넓어 정답과의 연결이 약할 수 있습니다.",
  },
  duplicate_front: {
    severity: "info",
    title: "중복 앞면",
    detail: "같은 질문이 여러 줄 존재합니다.",
  },
  manual_review: {
    severity: "info",
    title: "수동 검수",
    detail: "사용자가 직접 검수 대상으로 선택했습니다.",
  },
};

export function parseDeckText(
  text: string,
  profile: DeckProfile,
  sourceName = "pasted.txt",
): PreflightReport {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const cards: ParsedCard[] = [];
  const issues: PreflightIssue[] = [];
  const subjectCounts: Record<string, number> = {};

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    if (!line.trim()) {
      return;
    }

    const fields = line.split(";");
    const baseCard = makeCard(lineNo, line, fields, profile);
    cards.push(baseCard);

    if (fields.length !== profile.expectedFields) {
      issues.push(makeIssue(baseCard, "field_broken"));
      return;
    }

    if (baseCard.subject) {
      subjectCounts[baseCard.subject] = (subjectCounts[baseCard.subject] ?? 0) + 1;
    }

    for (const issueType of flagCard(baseCard, profile)) {
      issues.push(makeIssue(baseCard, issueType));
    }
  });

  const issueCounts = countBy(issues, "type") as Record<IssueType, number>;
  const severityCounts = countBy(issues, "severity") as Record<IssueSeverity, number>;

  return {
    profileId: profile.id,
    sourceName,
    totalLines: lines.length,
    totalCards: cards.length,
    validCards: cards.filter((card) => card.fields.length === profile.expectedFields).length,
    issueRecords: issues.length,
    subjectCounts,
    issueCounts,
    severityCounts,
    cards,
    issues,
  };
}

function makeCard(
  lineNo: number,
  raw: string,
  fields: string[],
  profile: DeckProfile,
): ParsedCard {
  const [ref = "", front = "", back = "", extra = ""] = fields;
  let subject: string | undefined;
  if (profile.subjectPattern) {
    const match = ref.match(profile.subjectPattern);
    if (match) {
      subject = `${match[1]}과목: ${match[2].trim()}`;
    }
  }

  return {
    id: `line-${lineNo}`,
    lineNo,
    raw,
    fields,
    ref,
    front,
    back,
    extra,
    subject,
  };
}

function flagCard(card: ParsedCard, profile: DeckProfile): IssueType[] {
  const flags = new Set<IssueType>();
  const front = card.front.trim();
  const back = card.back.trim();

  if (profile.choiceDependentTokens.some((token) => front.includes(token))) {
    flags.add("choice_dependent");
  }
  if (profile.negativeTokens.some((token) => front.includes(token))) {
    flags.add("negative_trace");
  }
  if (profile.vagueFrontTokens.some((token) => front.endsWith(token)) && !hasClearAxis(front, profile)) {
    flags.add("vague_front");
  }
  if (!front.startsWith("[OX]") && front.length > 130) {
    flags.add("long_front");
  }
  if (front.startsWith("[OX]") && front.length > 95) {
    flags.add("long_ox_front");
  }
  if (front.startsWith("[OX]") && ["O", "X"].includes(back) && !isCompleteOxStatement(front)) {
    flags.add("incomplete_ox_statement");
  }
  if (back.length > 220) {
    flags.add("long_back");
  }
  if (countableItems(back).length >= 6 || slashCount(back) >= 5) {
    flags.add("heavy_list");
  }
  if (isNumericAnswerWithoutContext(front, back)) {
    flags.add("numeric_no_unit");
  }

  const expected = expectedCount(front);
  if (expected) {
    const actual = countableItems(back).length;
    if (actual > 0 && actual !== expected) {
      flags.add("count_mismatch");
    }
  }

  if (!front.startsWith("[OX]") && front.length < 24 && !hasClearAxis(front, profile)) {
    flags.add("weak_axis");
  }

  return [...flags];
}

function makeIssue(
  card: ParsedCard,
  type: IssueType,
  detailOverride?: string,
): PreflightIssue {
  const meta = issueMeta[type];
  return {
    id: `${card.id}-${type}`,
    cardId: card.id,
    lineNo: card.lineNo,
    type,
    severity: meta.severity,
    title: meta.title,
    detail: detailOverride ?? meta.detail,
    ref: card.ref,
    front: card.front,
    back: card.back,
    extra: card.extra,
    suggestion: suggestionFor(type),
  };
}

function suggestionFor(type: IssueType): string | undefined {
  switch (type) {
    case "choice_dependent":
      return "선택지 없이 성립하도록 질문 축을 바꾸거나 이미지/표 문항으로 분리합니다.";
    case "negative_trace":
      return "부정형 오답만 남기지 말고 OX, 직접 회상, 문제-정답 역전을 검토합니다.";
    case "heavy_list":
    case "long_back":
      return "4개 이상 목록이면 분할하거나 각 항목을 OX 카드로 바꿉니다.";
    case "numeric_no_unit":
      return "단위, 공식, 적용 조건을 뒷면에 보강합니다.";
    case "incomplete_ox_statement":
      return "앞면을 완결된 명제로 다시 씁니다.";
    default:
      return undefined;
  }
}

function hasClearAxis(front: string, profile: DeckProfile): boolean {
  if (/\d+\s*가지|\d+\s*단계|\d+\s*원칙/.test(front)) {
    return true;
  }
  return profile.clearAxisTokens.some((token) => front.includes(token));
}

function isCompleteOxStatement(front: string): boolean {
  const statement = front.replace(/^\[OX\]\s*/, "").trim().replace(/[.?]$/, "");
  return /(다|임|아님|않음|있음|없음|필요함|해당함|금지됨|된다|한다|높다|낮다)$/.test(statement);
}

function slashCount(text: string): number {
  return (text.match(/ \/ /g) ?? []).length;
}

function isNumericAnswerWithoutContext(front: string, back: string): boolean {
  if (!/^\d+(?:\.\d+)?$/.test(back)) {
    return false;
  }
  if (/코드|비트|bit|진수|이진|해밍|패리티|번호|순서|단계|개수/i.test(front)) {
    return false;
  }
  return /몇|얼마|거리|시간|전압|전류|저항|압력|온도|중량|하중|속도|강도율|도수율|율|면적|체적|농도|질량|열량/.test(front);
}

function expectedCount(front: string): number | undefined {
  const match = front.match(/(\d+)\s*가지/);
  return match ? Number(match[1]) : undefined;
}

function countableItems(text: string): string[] {
  if (text.includes(" / ")) {
    return text.split(" / ").map((part) => part.trim()).filter(Boolean);
  }
  if (text.includes(",")) {
    return text.split(",").map((part) => part.trim()).filter(Boolean);
  }
  return [];
}

function countBy<T extends Record<string, unknown>>(
  rows: T[],
  key: keyof T,
): Record<string, number> {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const value = String(row[key]);
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export function sampleCards<T extends { id: string }>(
  rows: T[],
  count: number,
  excludedIds: Set<string> = new Set(),
): T[] {
  const pool = rows.filter((row) => !excludedIds.has(row.id));
  const shuffled = [...pool];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.slice(0, Math.max(1, Math.min(count, shuffled.length)));
}

export function buildFixRequest(
  issues: PreflightIssue[],
  reasons: Record<string, ReviewReason>,
  notes: Record<string, string>,
  sourceName: string,
): string {
  const lines = [
    "# ANKI_REVIEW_FIX_REQUEST",
    `source: ${sourceName}`,
    "task: 아래 문항들을 덱 가이드라인에 맞게 수정하고, 필요하면 문제 분할, OX 전환, 용어 설명을 적용할 것",
    "",
  ];

  issues.forEach((issue, index) => {
    lines.push(`## item ${index + 1}`);
    lines.push(`ref: ${issue.ref}`);
    lines.push(`line_no: ${issue.lineNo}`);
    lines.push(`reason: ${reasons[issue.id] ?? defaultReasonFor(issue.type)}`);
    lines.push(`note: ${notes[issue.id] ?? ""}`);
    lines.push(`front: ${issue.front}`);
    lines.push(`back: ${issue.back}`);
    lines.push(`extra: ${issue.extra}`);
    lines.push("");
  });

  return lines.join("\n");
}

export function makeManualIssue(card: ParsedCard): PreflightIssue {
  return makeIssue(card, "manual_review");
}

export function buildIssueTsv(
  issues: PreflightIssue[],
  reasons: Record<string, ReviewReason>,
): string {
  const rows = [
    ["line_no", "issue", "severity", "reason", "ref", "front", "back"].join("\t"),
    ...issues.map((issue) =>
      [
        issue.lineNo,
        issue.type,
        issue.severity,
        reasons[issue.id] ?? defaultReasonFor(issue.type),
        issue.ref,
        issue.front,
        issue.back,
      ]
        .map((value) => String(value).replace(/\s+/g, " ").trim())
        .join("\t"),
    ),
  ];
  return rows.join("\n");
}

export function buildSummaryPrompt(report: PreflightReport, sourceName: string): string {
  const lines = [
    "# ANKI_PREFLIGHT_SUMMARY",
    `source: ${sourceName}`,
    "task: 아래 자동 검수 요약을 보고 구조적 문제가 많은 유형부터 덱 수정 우선순위와 수정 지침을 제안할 것",
    "",
    "## 전체 요약",
    `- total_cards: ${report.totalCards}`,
    `- valid_cards: ${report.validCards}`,
    `- issue_records: ${report.issueRecords}`,
    `- errors: ${report.severityCounts.error ?? 0}`,
    `- warnings: ${report.severityCounts.warning ?? 0}`,
    `- info: ${report.severityCounts.info ?? 0}`,
    "",
    "## 과목 분포",
    ...Object.entries(report.subjectCounts).map(([subject, count]) => `- ${subject}: ${count}`),
    "",
    "## 이슈 분포",
    ...Object.entries(report.issueCounts)
      .sort((left, right) => right[1] - left[1])
      .map(([type, count]) => `- ${type}: ${count}`),
    "",
    "## 이슈 유형별 샘플",
  ];

  Object.entries(groupIssues(report.issues)).forEach(([type, issues]) => {
    lines.push("");
    lines.push(`### ${type}`);
    issues.slice(0, 3).forEach((issue) => {
      lines.push(`- line ${issue.lineNo} ${issue.ref}`);
      lines.push(`  - front: ${issue.front}`);
      lines.push(`  - back: ${issue.back}`);
      lines.push(`  - detail: ${issue.detail}`);
    });
  });

  return lines.join("\n");
}

function groupIssues(issues: PreflightIssue[]): Record<string, PreflightIssue[]> {
  return issues.reduce<Record<string, PreflightIssue[]>>((groups, issue) => {
    groups[issue.type] = groups[issue.type] ?? [];
    groups[issue.type].push(issue);
    return groups;
  }, {});
}

export function defaultReasonFor(type: IssueType): ReviewReason {
  if (type === "heavy_list" || type === "long_back" || type === "count_mismatch") {
    return "정답 과다/과소";
  }
  if (type === "choice_dependent" || type === "negative_trace" || type === "vague_front") {
    return "질문 축 수정 필요";
  }
  if (type === "numeric_no_unit" || type === "incomplete_ox_statement") {
    return "문체/오타";
  }
  return "원본 대조 필요";
}
