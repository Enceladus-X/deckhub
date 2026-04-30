"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  FileArchive,
  GitBranch,
  Link as LinkIcon,
  UploadCloud,
} from "lucide-react";

export function UploadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  function submitUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      className="rounded-lg border border-zinc-200 bg-white p-5"
      onSubmit={submitUpload}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-zinc-800">시험 기관</span>
          <select
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            defaultValue="AWS"
            name="provider"
          >
            <option>AWS</option>
            <option>Google Cloud</option>
            <option>Microsoft</option>
            <option>Linux Foundation</option>
            <option>Security</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-zinc-800">시험 코드</span>
          <input
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="examCode"
            placeholder="SAA-C03"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-zinc-800">
            시험 과목/트랙
          </span>
          <input
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="examTrack"
            placeholder="Cloud Architecture"
            required
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-zinc-800">덱 제목</span>
          <input
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="title"
            placeholder="AWS Solutions Architect Associate"
            required
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
            placeholder="2026.05"
            required
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
            placeholder="https://..."
            type="url"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-zinc-800">변경 내용</span>
          <textarea
            className="min-h-28 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="changelog"
            placeholder="추가/수정된 시험 범위와 카드 품질 메모"
            required
          />
        </label>

        <label className="md:col-span-2">
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
          </div>
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-5 md:flex-row md:items-center md:justify-between">
        <label className="flex items-start gap-2 text-sm leading-6 text-zinc-600">
          <input className="mt-1" required type="checkbox" />
          <span>공개 배포 가능한 자료이며 민감 정보가 포함되어 있지 않습니다.</span>
        </label>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
          type="submit"
        >
          <UploadCloud size={17} aria-hidden="true" />
          검토 요청
        </button>
      </div>

      {submitted ? (
        <div className="mt-5 flex items-start gap-3 rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
          <CheckCircle2 size={19} aria-hidden="true" />
          <p>제출 대기열에 추가되었습니다. 검수 상태는 업로드 기록에 표시됩니다.</p>
        </div>
      ) : null}
    </form>
  );
}
