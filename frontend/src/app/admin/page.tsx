"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, FileWarning, ShieldCheck, XCircle } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { reviewQueue } from "@/lib/deck-data";

type Decision = "approved" | "rejected";

export default function AdminPage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-zinc-950">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <Link
          className="text-sm font-medium text-zinc-500 transition hover:text-teal-700"
          href="/"
        >
          Catalog
        </Link>

        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-700">
                운영자 검수
              </p>
              <h1 className="mt-1 text-2xl font-semibold leading-8">
                업로드 대기열
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                공개 전 파일 형식, 중복 여부, 출처, 신고 가능성을 확인합니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-md border border-zinc-200 px-3 py-2">
                <p className="font-semibold text-zinc-900">
                  {reviewQueue.length}
                </p>
                <p className="text-xs text-zinc-500">대기</p>
              </div>
              <div className="rounded-md border border-zinc-200 px-3 py-2">
                <p className="font-semibold text-zinc-900">
                  {
                    Object.values(decisions).filter(
                      (decision) => decision === "approved",
                    ).length
                  }
                </p>
                <p className="text-xs text-zinc-500">승인</p>
              </div>
              <div className="rounded-md border border-zinc-200 px-3 py-2">
                <p className="font-semibold text-zinc-900">
                  {
                    Object.values(decisions).filter(
                      (decision) => decision === "rejected",
                    ).length
                  }
                </p>
                <p className="text-xs text-zinc-500">반려</p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {reviewQueue.map((item) => {
              const decision = decisions[item.id];

              return (
                <article
                  className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                  key={item.id}
                >
                  <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">
                          {item.category}
                        </span>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            item.risk === "낮음"
                              ? "bg-teal-50 text-teal-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          위험도 {item.risk}
                        </span>
                        {decision ? (
                          <span className="rounded-md bg-zinc-950 px-2 py-1 text-xs font-semibold text-white">
                            {decision === "approved" ? "승인됨" : "반려됨"}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-2 text-xl font-semibold text-zinc-950">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        {item.uploader} · {item.fileName} · {item.fileSize}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        접수 {item.submittedAt} · {item.id}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-md bg-zinc-50 p-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                          <FileWarning size={16} aria-hidden="true" />
                          체크리스트
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                          {item.checks.map((check) => (
                            <li className="flex items-center gap-2" key={check}>
                              <ShieldCheck
                                size={14}
                                className="text-teal-600"
                                aria-hidden="true"
                              />
                              {check}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                          onClick={() =>
                            setDecisions((current) => ({
                              ...current,
                              [item.id]: "approved",
                            }))
                          }
                          type="button"
                        >
                          <CheckCircle2 size={16} aria-hidden="true" />
                          승인
                        </button>
                        <button
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition hover:border-amber-400 hover:text-amber-700"
                          onClick={() =>
                            setDecisions((current) => ({
                              ...current,
                              [item.id]: "rejected",
                            }))
                          }
                          type="button"
                        >
                          <XCircle size={16} aria-hidden="true" />
                          반려
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
