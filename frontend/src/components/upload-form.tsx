"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  Code2,
  FileArchive,
  GitBranch,
  Layers3,
  Link as LinkIcon,
  Lock,
  PanelTop,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { categories } from "@/lib/deck-data";

const uploadCategories = categories.filter((category) => category !== "전체");

const cardCss = `.deckhub-card {
  min-height: 360px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  background: #ffffff;
  color: #18181b;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.65;
}

.deckhub-card__label {
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.deckhub-card__question {
  font-size: 30px;
  font-weight: 800;
}

.deckhub-card__answer {
  font-size: 22px;
  font-weight: 700;
}

.deckhub-card__note {
  border-left: 3px solid #14b8a6;
  background: #f4f4f5;
  color: #52525b;
}`;

export function UploadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("IT");
  const [examTrack, setExamTrack] = useState("");
  const [version, setVersion] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [changelog, setChangelog] = useState("");
  const [front, setFront] = useState("정규화의 목적은?");
  const [back, setBack] = useState(
    "데이터 중복을 줄이고 삽입, 삭제, 갱신 이상을 방지하는 것이다.",
  );
  const [extra, setExtra] = useState(
    "시험에서는 1NF, 2NF, 3NF, BCNF의 차이를 구분하는 문제가 자주 나옵니다.",
  );
  const [signedIn, setSignedIn] = useState(false);
  const [reviewId, setReviewId] = useState("");
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  const fileLooksValid = fileName.toLowerCase().endsWith(".apkg");
  const deckTitle = title || "정보처리기사 필기 핵심 덱";
  const trackLabel = examTrack || "국가기술자격 · 기사";
  const versionLabel = version || "2026.05";
  const sourceLabel = sourceUrl || "참고 링크 미입력";

  function submitUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signedIn || !fileLooksValid) {
      return;
    }
    setReviewId(`review-${Date.now().toString(36).slice(-6)}`);
    setSubmitted(true);
  }

  return (
    <form
      className="rounded-lg border border-zinc-200 bg-white p-5"
      onSubmit={submitUpload}
    >
      <style>{cardCss}</style>

      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-zinc-700">
            <Lock size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              업로드는 로그인한 사용자만 가능합니다
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              MVP에서는 인증 흐름을 시뮬레이션하고, 실제 배포에서는 Cognito나 OAuth로 연결합니다.
            </p>
          </div>
        </div>
        <button
          className={`inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-semibold transition ${
            signedIn
              ? "bg-teal-50 text-teal-700"
              : "bg-zinc-950 text-white hover:bg-teal-700"
          }`}
          onClick={() => setSignedIn((value) => !value)}
          type="button"
        >
          {signedIn ? "로그인됨" : "게스트 로그인"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <div className="space-y-5">
          <section className="rounded-lg border border-zinc-200 p-4">
            <div className="flex items-center gap-2">
              <Layers3 size={18} className="text-teal-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-zinc-950">덱 정보</h2>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-800">분류</span>
                <select
                  className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  name="category"
                  onChange={(event) => setCategory(event.target.value)}
                  value={category}
                >
                  {uploadCategories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-800">
                  자격 구분
                </span>
                <input
                  className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  name="examTrack"
                  onChange={(event) => setExamTrack(event.target.value)}
                  placeholder="국가기술자격 · 기사"
                  required
                  value={examTrack}
                />
              </label>

              <label className="space-y-2 md:col-span-2 xl:col-span-1">
                <span className="text-sm font-semibold text-zinc-800">
                  덱 제목
                </span>
                <input
                  className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  name="title"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="정보처리기사 필기 핵심 덱"
                  required
                  value={title}
                />
              </label>

              <label className="space-y-2">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
                  <GitBranch size={15} aria-hidden="true" />
                  버전
                </span>
                <input
                  className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  name="version"
                  onChange={(event) => setVersion(event.target.value)}
                  placeholder="2026.05"
                  required
                  value={version}
                />
              </label>

              <label className="space-y-2">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
                  <LinkIcon size={15} aria-hidden="true" />
                  참고 링크
                </span>
                <input
                  className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  name="sourceUrl"
                  onChange={(event) => setSourceUrl(event.target.value)}
                  placeholder="https://www.q-net.or.kr/..."
                  type="url"
                  value={sourceUrl}
                />
              </label>

              <label className="space-y-2 md:col-span-2 xl:col-span-1">
                <span className="text-sm font-semibold text-zinc-800">
                  변경 내용
                </span>
                <textarea
                  className="min-h-28 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  name="changelog"
                  onChange={(event) => setChangelog(event.target.value)}
                  placeholder="추가/수정한 범위, 출제기준 반영 여부, 카드 품질 메모"
                  required
                  value={changelog}
                />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 p-4">
            <div className="flex items-center gap-2">
              <PanelTop size={18} className="text-teal-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-zinc-950">카드 구성</h2>
            </div>

            <div className="mt-4 space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-800">
                  앞면
                </span>
                <textarea
                  className="min-h-24 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  name="front"
                  onChange={(event) => setFront(event.target.value)}
                  required
                  value={front}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-800">
                  뒷면
                </span>
                <textarea
                  className="min-h-28 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  name="back"
                  onChange={(event) => setBack(event.target.value)}
                  required
                  value={back}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-800">
                  보충 설명
                </span>
                <textarea
                  className="min-h-24 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  name="extra"
                  onChange={(event) => setExtra(event.target.value)}
                  value={extra}
                />
              </label>
            </div>
          </section>

          <label className="block rounded-lg border border-zinc-200 p-4">
            <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
              <FileArchive size={15} aria-hidden="true" />
              Anki 패키지
            </span>
            <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center transition focus-within:border-teal-600">
              <UploadCloud size={28} className="text-zinc-500" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-zinc-800">
                {fileName || ".apkg 파일 선택"}
              </p>
              <input
                accept=".apkg"
                className="mt-4 max-w-64 text-sm text-zinc-600"
                name="deckFile"
                onChange={(event) =>
                  setFileName(event.target.files?.[0]?.name ?? "")
                }
                required
                type="file"
              />
              {fileName && !fileLooksValid ? (
                <p className="mt-2 text-sm font-medium text-red-600">
                  .apkg 파일만 업로드할 수 있습니다.
                </p>
              ) : null}
            </div>
          </label>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  카드 디자인 미리보기
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  CSS가 적용된 앞면과 뒷면을 크게 확인합니다.
                </p>
              </div>
              <div className="flex rounded-md border border-zinc-200 bg-white p-1">
                {(["front", "back"] as const).map((side) => (
                  <button
                    className={`h-9 rounded px-4 text-sm font-semibold transition ${
                      previewSide === side
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                    key={side}
                    onClick={() => setPreviewSide(side)}
                    type="button"
                  >
                    {side === "front" ? "앞면" : "뒷면"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 deckhub-card flex flex-col justify-between p-8 shadow-sm">
              <div>
                <p className="deckhub-card__label">
                  {previewSide === "front" ? "Question" : "Answer"}
                </p>
                {previewSide === "front" ? (
                  <p className="deckhub-card__question mt-5">
                    {front || "앞면 내용을 입력하세요."}
                  </p>
                ) : (
                  <div className="mt-5 space-y-6">
                    <p className="deckhub-card__answer">
                      {back || "뒷면 내용을 입력하세요."}
                    </p>
                    <p className="deckhub-card__note rounded-md p-4 text-base">
                      {extra || "보충 설명을 입력하면 이 영역에 표시됩니다."}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-4 text-sm text-zinc-500">
                <span>{deckTitle}</span>
                <span>v{versionLabel}</span>
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h2 className="text-lg font-semibold text-zinc-950">덱 구성</h2>
              <div className="mt-4 divide-y divide-zinc-100">
                {[
                  ["덱 제목", deckTitle],
                  ["분류", category],
                  ["자격 구분", trackLabel],
                  ["버전", versionLabel],
                  ["출처", sourceLabel],
                  ["파일", fileName || ".apkg 파일 미선택"],
                  ["공개 상태", "검토 대기"],
                ].map(([label, value]) => (
                  <div
                    className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    key={label}
                  >
                    <span className="text-sm text-zinc-500">{label}</span>
                    <span className="max-w-64 text-right text-sm font-semibold text-zinc-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h2 className="text-lg font-semibold text-zinc-950">카드 구성</h2>
              <div className="mt-4 divide-y divide-zinc-100">
                {[
                  ["노트 타입", "DeckHub Basic"],
                  ["필드", "Front / Back / Extra"],
                  ["앞면 템플릿", "질문 + 덱 제목"],
                  ["뒷면 템플릿", "답변 + 보충 설명"],
                  ["스타일", "아래 CSS 코드 적용"],
                ].map(([label, value]) => (
                  <div
                    className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    key={label}
                  >
                    <span className="text-sm text-zinc-500">{label}</span>
                    <span className="max-w-64 text-right text-sm font-semibold text-zinc-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-zinc-950 p-4 text-white">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-teal-300" aria-hidden="true" />
              <h2 className="text-lg font-semibold">카드 CSS</h2>
            </div>
            <pre className="mt-4 max-h-80 overflow-auto rounded-md bg-black/35 p-4 text-xs leading-5 text-zinc-100">
              <code>{cardCss}</code>
            </pre>
          </section>
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-3">
        {[
          [ShieldCheck, "파일 검사", fileLooksValid ? "확장자 통과" : ".apkg 필요"],
          [ShieldCheck, "카드 검사", front && back ? "앞/뒤 필드 확인" : "앞/뒤 필드 필요"],
          [ShieldCheck, "공개 상태", "검토 대기"],
        ].map(([Icon, label, value]) => (
          <div className="flex items-start gap-2" key={label as string}>
            <Icon
              size={16}
              className="mt-0.5 shrink-0 text-teal-600"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-zinc-800">
                {label as string}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{value as string}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-5 md:flex-row md:items-center md:justify-between">
        <label className="flex items-start gap-2 text-sm leading-6 text-zinc-600">
          <input className="mt-1" required type="checkbox" />
          <span>
            공개 배포 가능한 자료이며 저작권 침해 자료나 민감 정보가 포함되어 있지 않습니다.
          </span>
        </label>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          disabled={!signedIn || !fileLooksValid || !front.trim() || !back.trim()}
          type="submit"
        >
          <UploadCloud size={17} aria-hidden="true" />
          검토 요청
        </button>
      </div>

      {submitted ? (
        <div className="mt-5 flex items-start gap-3 rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
          <CheckCircle2 size={19} aria-hidden="true" />
          <p>
            {deckTitle}이 검토 대기열에 추가되었습니다. 접수번호는 {reviewId}입니다.
          </p>
        </div>
      ) : null}
    </form>
  );
}
