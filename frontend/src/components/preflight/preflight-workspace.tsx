"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  FileText,
  FileUp,
  Filter,
  ListChecks,
  Trash2,
} from "lucide-react";
import { Badge, SectionTitle, StatCard, Surface } from "@/components/ui-kit";
import { industrialSafetyProfile } from "@/lib/preflight/profiles";
import type {
  IssueSeverity,
  IssueType,
  PreflightIssue,
  PreflightReport,
  ReviewReason,
} from "@/lib/preflight/types";
import { reviewReasons } from "@/lib/preflight/types";
import {
  buildFixRequest,
  buildIssueTsv,
  buildSummaryPrompt,
  defaultReasonFor,
  parseDeckText,
} from "@/lib/preflight/validators";

const SESSION_KEY = "deckhub:preflight-session:v2";
const ISSUE_PAGE_SIZE = 10;

type StoredSession = {
  inputText: string;
  sourceName: string;
};

type IssueFilter = IssueType | "all";
type SeverityFilter = IssueSeverity | "all";

type ReadyItem = {
  issue: PreflightIssue;
  reason: ReviewReason;
  note: string;
};

export function PreflightWorkspace() {
  const [initialSession] = useState(readStoredSession);
  const [inputText, setInputText] = useState(initialSession.inputText);
  const [sourceName, setSourceName] = useState(initialSession.sourceName);
  const [report, setReport] = useState<PreflightReport | null>(null);
  const [readyItems, setReadyItems] = useState<ReadyItem[]>([]);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [issueFilter, setIssueFilter] = useState<IssueFilter>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [issueCursor, setIssueCursor] = useState(0);
  const [copyState, setCopyState] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const session: StoredSession = { inputText, sourceName };
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Large pasted decks can exceed localStorage. The tool still works without persistence.
    }
  }, [inputText, sourceName]);

  const readyIds = useMemo(
    () => new Set(readyItems.map((item) => item.issue.id)),
    [readyItems],
  );

  const filteredIssues = useMemo(() => {
    if (!report) {
      return [];
    }
    return report.issues.filter((issue) => {
      const typeOk = issueFilter === "all" || issue.type === issueFilter;
      const severityOk = severityFilter === "all" || issue.severity === severityFilter;
      return typeOk && severityOk && !readyIds.has(issue.id);
    });
  }, [issueFilter, readyIds, report, severityFilter]);

  const maxIssueCursor = filteredIssues.length
    ? Math.floor((filteredIssues.length - 1) / ISSUE_PAGE_SIZE) * ISSUE_PAGE_SIZE
    : 0;
  const safeIssueCursor = Math.min(issueCursor, maxIssueCursor);
  const visibleIssues = filteredIssues.slice(safeIssueCursor, safeIssueCursor + ISSUE_PAGE_SIZE);
  const issueTypes = report ? Object.keys(report.issueCounts).sort() as IssueType[] : [];
  const currentRangeStart = filteredIssues.length ? safeIssueCursor + 1 : 0;
  const currentRangeEnd = Math.min(safeIssueCursor + ISSUE_PAGE_SIZE, filteredIssues.length);

  function analyze() {
    const currentText = inputRef.current?.value ?? inputText;
    setInputText(currentText);
    setReport(parseDeckText(currentText, industrialSafetyProfile, sourceName));
    resetReviewState();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    setInputText(text);
    setSourceName(file.name);
    setReport(parseDeckText(text, industrialSafetyProfile, file.name));
    resetReviewState();
  }

  function resetReviewState() {
    setReadyItems([]);
    setDraftNotes({});
    setIssueCursor(0);
    setCopyState("");
  }

  function commitIssue(issue: PreflightIssue, reason: ReviewReason) {
    const note = draftNotes[issue.id] ?? "";
    setReadyItems((current) => [
      ...current.filter((item) => item.issue.id !== issue.id),
      { issue, reason, note },
    ]);
    setDraftNotes((current) => {
      const next = { ...current };
      delete next[issue.id];
      return next;
    });
  }

  function removeReadyItem(issueId: string) {
    setReadyItems((current) => current.filter((item) => item.issue.id !== issueId));
  }

  async function copySummaryPrompt() {
    if (!report) {
      return;
    }
    await copyText(buildSummaryPrompt(report, sourceName));
    setCopyState("검수 요약 MD 복사됨");
  }

  async function copyFixRequest() {
    if (readyItems.length === 0) {
      return;
    }
    const payload = buildFixRequest(
      readyItems.map((item) => item.issue),
      Object.fromEntries(readyItems.map((item) => [item.issue.id, item.reason])),
      Object.fromEntries(readyItems.map((item) => [item.issue.id, item.note])),
      sourceName,
    );
    await copyText(payload);
    setCopyState(`${readyItems.length}개 문항 복사됨`);
  }

  async function copyTsv() {
    if (readyItems.length === 0) {
      return;
    }
    const payload = buildIssueTsv(
      readyItems.map((item) => item.issue),
      Object.fromEntries(readyItems.map((item) => [item.issue.id, item.reason])),
    );
    await copyText(payload);
    setCopyState("TSV 복사됨");
  }

  function downloadReport() {
    if (!report) {
      return;
    }
    downloadText(
      `${sourceName.replace(/\.[^.]+$/, "") || "deck"}_preflight_report.json`,
      JSON.stringify(report, null, 2),
      "application/json",
    );
  }

  function resetSession() {
    setInputText("");
    setSourceName("pasted.txt");
    setReport(null);
    resetReviewState();
    window.localStorage.removeItem(SESSION_KEY);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.65fr)]">
        <Surface className="p-5">
          <SectionTitle
            eyebrow="DeckHub Preflight"
            title="Anki TXT 검수"
            body="TXT를 브라우저 안에서만 읽고, 구조적으로 다시 볼 카드만 추려냅니다."
            icon={FileText}
          />

          <div className="mt-5 grid gap-3">
            <label className="grid gap-1.5 text-sm font-semibold text-zinc-700">
              TXT 파일
              <span className="relative flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-center transition hover:border-teal-500 hover:bg-teal-50/40">
                <input
                  accept=".txt,text/plain"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleFileChange}
                  type="file"
                />
                <span className="flex flex-col items-center gap-2 text-sm text-zinc-500">
                  <FileUp size={24} aria-hidden="true" />
                  {sourceName === "pasted.txt" ? "TXT 선택" : sourceName}
                </span>
              </span>
            </label>

            <label className="grid gap-1.5 text-sm font-semibold text-zinc-700">
              붙여넣기
              <textarea
                ref={inputRef}
                className="min-h-52 rounded-md border border-zinc-200 bg-white p-3 font-mono text-xs leading-5 outline-none focus:border-teal-600"
                onChange={(event) => {
                  setInputText(event.target.value);
                  setSourceName("pasted.txt");
                }}
                onInput={(event) => {
                  setInputText(event.currentTarget.value);
                  setSourceName("pasted.txt");
                }}
                placeholder="[22년 2회차 1번: 1과목: 안전관리론];앞면;뒷면;추가정보"
                value={inputText}
              />
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                onClick={analyze}
                type="button"
              >
                <ClipboardCheck size={16} aria-hidden="true" />
                검수 실행
              </button>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                onClick={resetSession}
                type="button"
              >
                <Trash2 size={16} aria-hidden="true" />
                초기화
              </button>
            </div>
          </div>
        </Surface>

        <Surface className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionTitle
              title="검수 요약"
              body="이슈 분포와 대표 샘플을 Markdown 프롬프트로 복사할 수 있습니다."
              icon={ListChecks}
            />
            <button
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!report}
              onClick={copySummaryPrompt}
              type="button"
            >
              <Copy size={16} aria-hidden="true" />
              요약 MD 복사
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatCard label="카드" value={report?.totalCards ?? 0} icon={FileText} />
            <StatCard label="이슈" value={report?.issueRecords ?? 0} icon={AlertTriangle} />
            <StatCard label="오류" value={report?.severityCounts.error ?? 0} icon={AlertTriangle} />
            <StatCard label="복사 대기" value={readyItems.length} icon={CheckCircle2} />
          </div>

          {report ? (
            <div className="mt-5 grid gap-4">
              <SummaryBucket title="과목 분포" empty="과목 정보 없음" entries={report.subjectCounts} />
              <SummaryBucket title="이슈 분포" entries={report.issueCounts} highlight />
            </div>
          ) : (
            <p className="mt-5 rounded-md bg-zinc-50 p-4 text-sm text-zinc-500">
              TXT를 업로드하거나 붙여넣은 뒤 검수 실행을 누르세요.
            </p>
          )}
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Surface className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              title="자동 검출 목록"
              body="10개씩 확인합니다. 카드 아래 사유 버튼을 누르면 바로 복사 대기로 이동합니다."
              icon={Filter}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                onChange={(event) => {
                  setSeverityFilter(event.target.value as SeverityFilter);
                  setIssueCursor(0);
                }}
                value={severityFilter}
              >
                <option value="all">모든 심각도</option>
                <option value="error">오류</option>
                <option value="warning">경고</option>
                <option value="info">참고</option>
              </select>
              <select
                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                onChange={(event) => {
                  setIssueFilter(event.target.value as IssueFilter);
                  setIssueCursor(0);
                }}
                value={issueFilter}
              >
                <option value="all">모든 이슈</option>
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-y border-zinc-100 py-3 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {currentRangeStart}-{currentRangeEnd} / {filteredIssues.length}
            </span>
            <div className="flex gap-2">
              <button
                className="h-9 rounded-md border border-zinc-200 px-3 font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40"
                disabled={safeIssueCursor === 0}
                onClick={() => setIssueCursor(Math.max(0, safeIssueCursor - ISSUE_PAGE_SIZE))}
                type="button"
              >
                이전 10개
              </button>
              <button
                className="h-9 rounded-md border border-zinc-200 px-3 font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40"
                disabled={safeIssueCursor + ISSUE_PAGE_SIZE >= filteredIssues.length}
                onClick={() => setIssueCursor(Math.min(maxIssueCursor, safeIssueCursor + ISSUE_PAGE_SIZE))}
                type="button"
              >
                다음 10개
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {visibleIssues.length ? (
              visibleIssues.map((issue) => (
                <IssueReviewCard
                  issue={issue}
                  key={issue.id}
                  note={draftNotes[issue.id] ?? ""}
                  onCommit={commitIssue}
                  onNoteChange={(nextNote) =>
                    setDraftNotes((current) => ({ ...current, [issue.id]: nextNote }))
                  }
                />
              ))
            ) : (
              <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                표시할 자동 검출 항목이 없습니다.
              </div>
            )}
          </div>
        </Surface>

        <Surface className="p-5">
          <SectionTitle
            title="복사 대기"
            body="사유 버튼을 누른 문항만 여기에 쌓입니다."
            icon={ClipboardCheck}
          />

          <div className="mt-4 flex flex-col gap-2">
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!readyItems.length}
              onClick={copyFixRequest}
              type="button"
            >
              <Copy size={16} aria-hidden="true" />
              수정 요청 복사
            </button>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!readyItems.length}
              onClick={copyTsv}
              type="button"
            >
              <Copy size={16} aria-hidden="true" />
              TSV 복사
            </button>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!report}
              onClick={downloadReport}
              type="button"
            >
              <Download size={16} aria-hidden="true" />
              리포트 저장
            </button>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!readyItems.length}
              onClick={() => setReadyItems([])}
              type="button"
            >
              <Trash2 size={16} aria-hidden="true" />
              복사 대기 비우기
            </button>
            {copyState ? <p className="text-sm text-teal-700">{copyState}</p> : null}
          </div>

          <div className="mt-4 grid max-h-[760px] gap-2 overflow-auto pr-1">
            {readyItems.length ? (
              readyItems.map((item) => (
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3" key={item.issue.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge tone="teal">{item.reason}</Badge>
                      <p className="mt-2 text-xs font-semibold text-zinc-500">
                        {item.issue.ref || `line ${item.issue.lineNo}`}
                      </p>
                    </div>
                    <button
                      className="rounded-md p-1.5 text-zinc-400 transition hover:bg-white hover:text-zinc-700"
                      onClick={() => removeReadyItem(item.issue.id)}
                      title="복사 대기에서 제거"
                      type="button"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">{item.issue.front}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.issue.back}</p>
                  {item.note ? (
                    <p className="mt-2 text-xs leading-5 text-zinc-500">메모: {item.note}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-500">
                자동 검출 목록에서 사유를 선택하면 여기에 쌓입니다.
              </p>
            )}
          </div>
        </Surface>
      </div>
    </section>
  );
}

function SummaryBucket({
  entries,
  empty = "없음",
  highlight = false,
  title,
}: {
  entries: Record<string, number>;
  empty?: string;
  highlight?: boolean;
  title: string;
}) {
  const rows = Object.entries(entries).sort((left, right) => right[1] - left[1]);
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-700">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {rows.length ? (
          rows.map(([label, count]) => (
            <Badge key={label} tone={highlight ? "amber" : "zinc"}>
              {label} {count}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-zinc-500">{empty}</span>
        )}
      </div>
    </div>
  );
}

function IssueReviewCard({
  issue,
  note,
  onCommit,
  onNoteChange,
}: {
  issue: PreflightIssue;
  note: string;
  onCommit: (issue: PreflightIssue, reason: ReviewReason) => void;
  onNoteChange: (note: string) => void;
}) {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={issue.severity === "error" ? "amber" : "zinc"}>
              {issue.severity}
            </Badge>
            <span className="text-sm font-semibold text-zinc-900">{issue.title}</span>
            <span className="text-xs text-zinc-500">{issue.type}</span>
          </div>
          <p className="mt-2 text-xs font-semibold text-zinc-500">
            {issue.ref || `line ${issue.lineNo}`}
          </p>
        </div>
        <button
          className="h-8 rounded-md border border-zinc-200 px-2 text-xs font-semibold text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-50"
          onClick={() => onCommit(issue, defaultReasonFor(issue.type))}
          type="button"
        >
          추천 사유
        </button>
      </div>

      <p className="mt-2 text-sm font-semibold leading-6 text-zinc-900">{issue.front}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-600">{issue.back}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{issue.detail}</p>
      {issue.suggestion ? (
        <p className="mt-1 text-xs leading-5 text-teal-700">{issue.suggestion}</p>
      ) : null}

      <label className="mt-3 grid gap-1 text-xs font-semibold text-zinc-600">
        메모
        <input
          className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-teal-600"
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="선택 사항"
          value={note}
        />
      </label>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        {reviewReasons.map((reason) => (
          <button
            className="min-h-9 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-left text-xs font-semibold text-zinc-700 transition hover:border-teal-400 hover:bg-white hover:text-teal-700"
            key={reason}
            onClick={() => onCommit(issue, reason)}
            type="button"
          >
            {reason}
          </button>
        ))}
      </div>
    </article>
  );
}

function readStoredSession(): StoredSession {
  const fallback: StoredSession = {
    inputText: "",
    sourceName: "pasted.txt",
  };
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return fallback;
    }
    const session = JSON.parse(raw) as Partial<StoredSession>;
    return {
      inputText: session.inputText ?? fallback.inputText,
      sourceName: session.sourceName ?? fallback.sourceName,
    };
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return fallback;
  }
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
