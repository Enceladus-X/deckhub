import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { PreflightWorkspace } from "@/components/preflight/preflight-workspace";

export default function PreflightPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] text-zinc-950">
      <AppHeader />
      <div className="mx-auto max-w-7xl px-5 pt-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-teal-700"
          href="/"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          카탈로그
        </Link>
      </div>
      <PreflightWorkspace />
    </main>
  );
}
