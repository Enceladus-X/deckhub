"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileWarning,
  ShieldCheck,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Badge, cx, SectionTitle, StatCard, Surface } from "@/components/ui-kit";
import { reviewQueue } from "@/lib/deck-data";

type Decision = "approved" | "rejected";

export default function AdminPage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const approvedCount = Object.values(decisions).filter(
    (decision) => decision === "approved",
  ).length;
  const rejectedCount = Object.values(decisions).filter(
    (decision) => decision === "rejected",
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-zinc-950">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-teal-700"
          href="/"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          카탈로그
        </Link>

        <Surface className="mt-4 overflow-hidden">
          <div className="border-b border-zinc-100 bg-zinc-950 p-6 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-teal-100">
                  <ShieldCheck size={15} aria-hidden="true" />
                  Moderator Console
                </div>
                <h1 className="mt-3 text-3xl font-semibold leading-10">
                  업로드 대기열
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                  공개 전 파일 형식, 중복 여부, 출처, 신고 가능성을 한 화면에서 확인합니다.
                </p>
              </div>

              <div className="grid gap-2 text-zinc-950 sm:grid-cols-3">
                <StatCard label="대기" value={reviewQueue.length} icon={UploadCloud} />
                <StatCard label="승인" value={approvedCount} icon={CheckCircle2} />
                <StatCard label="반려" value={rejectedCount} icon={XCircle} />
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5">
            {reviewQueue.map((item) => {
              const decision = decisions[item.id];
              const isLowRisk = item.risk === "낮음";

              return (
                <article
                  className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                  key={item.id}
                >
                  <div className="grid gap-4 lg:grid-cols-[1fr_340px] lg:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{item.category}</Badge>
                        <Badge tone={isLowRisk ? "teal" : "amber"}>
                          위험도 {item.risk}
                        </Badge>
                        {decision ? (
                          <Badge tone="dark">
                            {decision === "approved" ? "승인됨" : "반려됨"}
                          </Badge>
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
                      <div className="rounded-lg bg-zinc-50 p-3">
                        <SectionTitle title="검수 체크" icon={FileWarning} />
                        <ul className="mt-3 space-y-2 text-sm text-zinc-600">
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
                          className={cx(
                            "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition",
                            decision === "approved"
                              ? "bg-teal-50 text-teal-700"
                              : "bg-zinc-950 text-white hover:bg-teal-700",
                          )}
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
                          className={cx(
                            "inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition",
                            decision === "rejected"
                              ? "border-amber-300 bg-amber-50 text-amber-700"
                              : "border-zinc-200 text-zinc-700 hover:border-amber-400 hover:text-amber-700",
                          )}
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
        </Surface>
      </section>
    </main>
  );
}
