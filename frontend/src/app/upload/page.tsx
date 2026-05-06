import Link from "next/link";
import { Clock, FileCheck2, ShieldCheck, UploadCloud } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { UploadForm } from "@/components/upload-form";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] text-zinc-950">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <Link
          className="text-sm font-medium text-zinc-500 transition hover:text-teal-700"
          href="/"
        >
          Catalog
        </Link>

        <div className="mt-4 space-y-5">
          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                <UploadCloud size={22} aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold leading-8">
                  자격시험 덱 업로드
                </h1>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  파일, 출처, 카드 앞면/뒷면, CSS 미리보기, 덱 구성을 함께 확인하고 검토 대기 상태로 등록합니다.
                </p>
              </div>
            </div>
          </section>

          <UploadForm />

          <aside className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold leading-7">검토 흐름</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                [FileCheck2, "파일 확인", ".apkg, SHA256, 파일 크기"],
                [ShieldCheck, "공개 검토", "저작권, 개인정보, 악성 파일"],
                [Clock, "버전 등록", "덮어쓰기 없는 버전별 배포"],
              ].map(([Icon, title, body]) => (
                <div
                  className="flex gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-4"
                  key={title as string}
                >
                  <Icon
                    size={18}
                    className="mt-0.5 shrink-0 text-teal-600"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">
                      {title as string}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {body as string}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
