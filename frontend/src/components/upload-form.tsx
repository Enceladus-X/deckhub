"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  FileArchive,
  GitBranch,
  Link as LinkIcon,
  Lock,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { categories } from "@/lib/deck-data";

const uploadCategories = categories.filter((category) => category !== "전체");

export function UploadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [reviewId, setReviewId] = useState("");

  const fileLooksValid = fileName.toLowerCase().endsWith(".apkg");

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

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-zinc-800">분류</span>
          <select
            className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            defaultValue="IT"
            name="category"
          >
            {uploadCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-zinc-800">자격 구분</span>
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
          <span className="text-sm font-semibold text-zinc-800">변경 내용</span>
          <textarea
            className="min-h-28 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="changelog"
            placeholder="추가/수정한 과목 범위, 출제기준 반영 여부, 카드 품질 메모"
            required
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-zinc-800">
            샘플 카드 1개
          </span>
          <textarea
            className="min-h-24 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            name="sampleCard"
            placeholder="Front: 정규화의 목적은? / Back: 중복과 이상 현상을 줄이는 것이다."
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
            {fileName && !fileLooksValid ? (
              <p className="mt-2 text-sm font-medium text-red-600">
                .apkg 파일만 업로드할 수 있습니다.
              </p>
            ) : null}
          </div>
        </label>
      </div>

      <div className="mt-5 grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-3">
        {[
          [ShieldCheck, "파일 검사", fileLooksValid ? "확장자 통과" : ".apkg 필요"],
          [ShieldCheck, "중복 검사", "SHA256 기준 예정"],
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
          disabled={!signedIn || !fileLooksValid}
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
            {title || "새 덱"}이 검토 대기열에 추가되었습니다. 접수번호는 {reviewId}입니다.
          </p>
        </div>
      ) : null}
    </form>
  );
}
