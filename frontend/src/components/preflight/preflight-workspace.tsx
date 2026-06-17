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
  Shuffle,
  Trash2,
} from "lucide-react";
import { Badge, cx, SectionTitle, StatCard, Surface } from "@/components/ui-kit";
import { getPreflightProfile, preflightProfiles } from "@/lib/preflight/profiles";
import type {
  IssueSeverity,
  IssueType,
  ParsedCard,
  PreflightIssue,
  PreflightReport,
  ReviewReason,
} from "@/lib/preflight/types";
import { reviewReasons } from "@/lib/preflight/types";
import {
  buildFixRequest,
  buildIssueTsv,
  defaultReasonFor,
  makeManualIssue,
  parseDeckText,
  sampleCards,
} from "@/lib/preflight/validators";

const SESSION_KEY = "deckhub:preflight-session:v1";

type StoredSession = {
  inputText: string;
  sourceName: string;
  profileId: string;
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
  const [profileId, setProfileId] = useState(initialSession.profileId);
  const [report, setReport] = useState<PreflightReport | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<Record<string, PreflightIssue>>({});
  const [readyItems, setReadyItems] = useState<ReadyItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [issueFilter, setIssueFilter] = useState<IssueFilter>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [sampleSize, setSampleSize] = useState(10);
  const [sampledCards, setSampledCards] = useState<ParsedCard[]>([]);
  const [seenSampleIds, setSeenSampleIds] = useState<Set<string>>(new Set());
  const [copyState, setCopyState] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const session: StoredSession = { inputText, sourceName, profileId };
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Large pasted decks can exceed localStorage. The tool still works without persistence.
    }
  }, [inputText, sourceName, profileId]);

  const profile = useMemo(() => getPreflightProfile(profileId), [profileId]);
  const selectedList = useMemo(
    () => Object.values(selectedIssues).sort((left, right) => left.lineNo - right.lineNo),
    [selectedIssues],
  );
  const readyIds = useMemo(
    () => new Set(readyItems.map((item) => item.issue.id)),
    [readyItems],
  );
  const visibleIssues = useMemo(() => {
    if (!report) {
      return [];
    }
    return report.issues.filter((issue) => {
      const typeOk = issueFilter === "all" || issue.type === issueFilter;
      const severityOk = severityFilter === "all" || issue.severity === severityFilter;
      return typeOk && severityOk;
    });
  }, [issueFilter, report, severityFilter]);

  function analyze() {
    const currentText = inputRef.current?.value ?? inputText;
    setInputText(currentText);
    const nextReport = parseDeckText(currentText, profile, sourceName);
    setReport(nextReport);
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
    const nextReport = parseDeckText(text, profile, file.name);
    setReport(nextReport);
    resetReviewState();
  }

  function resetReviewState() {
    setSampledCards([]);
    setSeenSampleIds(new Set());
    setSelectedIssues({});
    setReadyItems([]);
    setNotes({});
    setCopyState("");
  }

  function toggleIssue(issue: PreflightIssue) {
    if (readyIds.has(issue.id)) {
      return;
    }
    setSelectedIssues((current) => {
      const next = { ...current };
      if (next[issue.id]) {
        delete next[issue.id];
      } else {
        next[issue.id] = issue;
      }
      return next;
    });
  }

  function commitIssue(issue: PreflightIssue, reason: ReviewReason) {
    const note = notes[issue.id] ?? "";
    setSelectedIssues((current) => {
      const next = { ...current };
      delete next[issue.id];
      return next;
    });
    setReadyItems((current) => [
      ...current.filter((item) => item.issue.id !== issue.id),
      { issue, reason, note },
    ]);
    setNotes((current) => {
      const next = { ...current };
      delete next[issue.id];
      return next;
    });
  }

  function removeReadyItem(issueId: string) {
    setReadyItems((current) => current.filter((item) => item.issue.id !== issueId));
  }

  function drawSample() {
    if (!report) {
      return;
    }
    const sample = sampleCards(report.cards, sampleSize, seenSampleIds);
    setSampledCards(sample);
    setSeenSampleIds((current) => {
      const next = new Set(current);
      sample.forEach((card) => next.add(card.id));
      if (next.size >= report.cards.length) {
        return new Set(sample.map((card) => card.id));
      }
      return next;
    });
  }

  function addSampleToReview(card: ParsedCard) {
    const issue = makeManualIssue(card);
    toggleIssue(issue);
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
    const issues = readyItems.length ? readyItems.map((item) => item.issue) : visibleIssues;
    const reasons = readyItems.length
      ? Object.fromEntries(readyItems.map((item) => [item.issue.id, item.reason]))
      : {};
    const payload = buildIssueTsv(issues, reasons);
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

  const issueTypes = report ? Object.keys(report.issueCounts).sort() as IssueType[] : [];

  return (
    <section className="mx-auto max-w-7xl px-5 py-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Surface className="p-5">
          <SectionTitle
            eyebrow="DeckHub Preflight"
            title="Anki TXT 검수"
            body="파일은 브라우저 안에서만 읽습니다. 업로드 서버 없이 필드 구조와 카드 신호를 확인합니다."
            icon={FileText}
          />

          <div className="mt-5 grid gap-3">
            <label className="grid gap-1.5 text-sm font-semibold text-zinc-700">
              프로필
              <select
                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                onChange={(event) => setProfileId(event.target.value)}
                value={profileId}
              >
                {preflightProfiles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal leading-5 text-zinc-500">
                {profile.description}
              </span>
            </label>

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

        <div className="space-y-5">
          <Surface className="p-5">
            <SectionTitle
              title="검수 요약"
              body="오류는 구조적으로 고쳐야 할 항목, 경고는 학습자 관점에서 다시 볼 항목입니다."
              icon={ListChecks}
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="카드" value={report?.totalCards ?? 0} icon={FileText} />
              <StatCard label="이슈" value={report?.issueRecords ?? 0} icon={AlertTriangle} />
              <StatCard label="오류" value={report?.severityCounts.error ?? 0} icon={AlertTriangle} />
              <StatCard label="검수함" value={selectedList.length} icon={CheckCircle2} />
            </div>

            {report ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-zinc-700">과목 분포</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(report.subjectCounts).length ? (
                      Object.entries(report.subjectCounts).map(([subject, count]) => (
                        <Badge key={subject} tone="zinc">
                          {subject} {count}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-zinc-500">과목 정보 없음</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-700">이슈 분포</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(report.issueCounts).map(([type, count]) => (
                      <Badge key={type} tone={count > 0 ? "amber" : "zinc"}>
                        {type} {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-5 rounded-md bg-zinc-50 p-4 text-sm text-zinc-500">
                TXT를 업로드하거나 붙여넣은 뒤 검수 실행을 누르세요.
              </p>
            )}
          </Surface>

          <Surface className="p-5">
            <SectionTitle
              title="무작위 샘플"
              body="자동 QC가 잡지 못한 카드를 사람이 직접 골라 검수함에 넣습니다."
              icon={Shuffle}
            />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                className="h-10 w-24 rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-teal-600"
                max={100}
                min={1}
                onChange={(event) => setSampleSize(Number(event.target.value))}
                type="number"
                value={sampleSize}
              />
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!report}
                onClick={drawSample}
                type="button"
              >
                <Shuffle size={16} aria-hidden="true" />
                새로 뽑기
              </button>
            </div>
            {sampledCards.length ? (
              <div className="mt-4 grid gap-2">
                {sampledCards.map((card) => (
                  <button
                    className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:border-teal-500 hover:bg-white"
                    key={card.id}
                    onClick={() => addSampleToReview(card)}
                    type="button"
                  >
                    <p className="text-xs font-semibold text-zinc-500">
                      {card.ref || `line ${card.lineNo}`}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">{card.front}</p>
                    <p className="mt-1 text-sm text-zinc-600">{card.back}</p>
                  </button>
                ))}
              </div>
            ) : null}
          </Surface>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Surface className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              title="자동 검출 목록"
              body="카드 전체를 클릭하면 검수함으로 이동합니다."
              icon={Filter}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                onChange={(event) => setSeverityFilter(event.target.value as SeverityFilter)}
                value={severityFilter}
              >
                <option value="all">모든 심각도</option>
                <option value="error">오류</option>
                <option value="warning">경고</option>
                <option value="info">참고</option>
              </select>
              <select
                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                onChange={(event) => setIssueFilter(event.target.value as IssueFilter)}
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

          <div className="mt-5 grid gap-2">
            {visibleIssues.length ? (
              visibleIssues.slice(0, 300).map((issue) => (
                <IssueRow
                  issue={issue}
                  key={issue.id}
                  onToggle={toggleIssue}
                  selected={Boolean(selectedIssues[issue.id])}
                  committed={readyIds.has(issue.id)}
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
            title="검수함"
            body="사유를 선택하면 복사 대기열로 이동하고 이 영역에서는 사라집니다."
            icon={ClipboardCheck}
          />

          <div className="mt-4 grid max-h-[360px] gap-3 overflow-auto pr-1">
            {selectedList.length ? (
              selectedList.map((issue) => (
                <ReviewCard
                  issue={issue}
                  key={issue.id}
                  note={notes[issue.id] ?? ""}
                  onCommit={commitIssue}
                  onNoteChange={(nextNote) =>
                    setNotes((current) => ({ ...current, [issue.id]: nextNote }))
                  }
                  onRemove={() => toggleIssue(issue)}
                />
              ))
            ) : (
              <p className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-500">
                자동 검출 목록이나 무작위 샘플을 클릭하면 여기에 모입니다.
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-5">
            <SectionTitle
              title="복사 대기"
              body="사유 선택이 끝난 문항만 복사됩니다."
              icon={Copy}
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
                disabled={!report}
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

            <div className="mt-4 grid max-h-[260px] gap-2 overflow-auto pr-1">
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
                  사유를 선택한 문항이 여기에 쌓입니다.
                </p>
              )}
            </div>
          </div>
        </Surface>
      </div>
    </section>
  );
}

function IssueRow({
  issue,
  onToggle,
  selected,
  committed,
}: {
  issue: PreflightIssue;
  onToggle: (issue: PreflightIssue) => void;
  selected: boolean;
  committed: boolean;
}) {
  return (
    <button
      aria-pressed={selected}
      className={cx(
        "rounded-md border p-3 text-left transition",
        selected
          ? "border-teal-500 bg-teal-50"
          : "border-zinc-200 bg-white hover:border-teal-400 hover:bg-zinc-50",
        committed && "opacity-60",
      )}
      onClick={() => onToggle(issue)}
      type="button"
    >
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
        {selected ? <Badge tone="teal">선택됨</Badge> : null}
        {committed ? <Badge tone="zinc">대기 중</Badge> : null}
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-zinc-900">{issue.front}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-600">{issue.back}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{issue.detail}</p>
      {issue.suggestion ? (
        <p className="mt-1 text-xs leading-5 text-teal-700">{issue.suggestion}</p>
      ) : null}
    </button>
  );
}

function ReviewCard({
  issue,
  note,
  onCommit,
  onNoteChange,
  onRemove,
}: {
  issue: PreflightIssue;
  note: string;
  onCommit: (issue: PreflightIssue, reason: ReviewReason) => void;
  onNoteChange: (note: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone={issue.severity === "error" ? "amber" : "zinc"}>{issue.title}</Badge>
          <p className="mt-2 text-xs font-semibold text-zinc-500">
            {issue.ref || `line ${issue.lineNo}`}
          </p>
        </div>
        <button
          className="rounded-md p-1.5 text-zinc-400 transition hover:bg-white hover:text-zinc-700"
          onClick={onRemove}
          title="검수함에서 제거"
          type="button"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>

      <p className="mt-2 text-sm font-semibold text-zinc-900">{issue.front}</p>
      <p className="mt-1 text-sm text-zinc-600">{issue.back}</p>

      <label className="mt-3 grid gap-1 text-xs font-semibold text-zinc-600">
        메모
        <input
          className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-teal-600"
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="선택 사항"
          value={note}
        />
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {reviewReasons.map((reason) => (
          <button
            className="min-h-9 rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-left text-xs font-semibold text-zinc-700 transition hover:border-teal-400 hover:text-teal-700"
            key={reason}
            onClick={() => onCommit(issue, reason)}
            type="button"
          >
            {reason}
          </button>
        ))}
      </div>

      <button
        className="mt-2 text-xs font-semibold text-zinc-400 transition hover:text-teal-700"
        onClick={() => onCommit(issue, defaultReasonFor(issue.type))}
        type="button"
      >
        추천 사유로 이동
      </button>
    </div>
  );
}

function readStoredSession(): StoredSession {
  const fallback: StoredSession = {
    inputText: "",
    sourceName: "pasted.txt",
    profileId: preflightProfiles[0].id,
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
      profileId: session.profileId ?? fallback.profileId,
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
