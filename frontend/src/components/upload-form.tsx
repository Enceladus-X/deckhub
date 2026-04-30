"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  FileArchive,
  GitBranch,
  Link as LinkIcon,
  UploadCloud,
} from "lucide-react";

const examDomains = [
  "IT/정보통신",
  "안전관리",
  "전기/전자",
  "건축",
  "부동산/관리",
  "전문서비스",
];

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
          <span className="text-sm font-semibold text-zinc-800">
            자격 분야
          </span>
          <select
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            defaultValue="IT/정보통신"
            name="provider"
          >
            {examDomains.map((domain) => (
              <option key={domain}>{domain}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-zinc-800">
            종목 코드
          </span>
          <input
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="examCode"
            placeholder="QNET-1320"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-zinc-800">
            자격 구분
          </span>
          <input
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="examTrack"
            placeholder="국가기술자격 · 기사"
            required
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-zinc-800">덱 제목</span>
          <input
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="title"
            placeholder="정보처리기사 필기 핵심 덱"
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
            placeholder="https://www.q-net.or.kr/..."
            type="url"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-zinc-800">
            변경 내용
          </span>
          <textarea
            className="min-h-28 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="changelog"
            placeholder="추가/수정한 과목 범위, 출제기준 반영 여부, 카드 품질 메모"
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
          <span>
            공개 배포 가능한 자료이며 저작권 침해 자료나 민감 정보가 포함되어 있지 않습니다.
          </span>
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
          <p>
            제출 대기열에 추가되었습니다. 실제 서비스에서는 검수 상태와 SHA256 해시를 업로드 기록에 표시합니다.
          </p>
        </div>
      ) : null}
    </form>
  );
}
