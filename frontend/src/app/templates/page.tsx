import { AppHeader } from "@/components/app-header";
import { TemplateMarketplace } from "@/components/template-marketplace";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] text-zinc-950">
      <AppHeader />
      <TemplateMarketplace />
    </main>
  );
}
