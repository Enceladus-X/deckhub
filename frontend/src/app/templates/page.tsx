import Link from "next/link";
import {
  Code2,
  Download,
  FileCode2,
  Heart,
  LayoutTemplate,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { CardTemplatePreview } from "@/components/card-template-preview";
import { Badge, InfoList, SectionTitle, StatCard, Surface, cx } from "@/components/ui-kit";
import {
  cardTemplates,
  getScopedTemplateCss,
  getTemplateScopeClass,
} from "@/lib/card-templates";

const sample = {
  back: "정답은 반복 가능한 최소 단위로 쪼개고, 보충 설명에는 예외 조건이나 시험 포인트를 적습니다.",
  category: "IT",
  deckTitle: "정보처리기사",
  extra: "긴 문장은 뒷면 설명으로 분리하면 모바일 복습에서도 가독성이 유지됩니다.",
  front: "DeckHub 카드 템플릿은 무엇을 공유하나요?",
  version: "2026.05",
};

export default function TemplatesPage() {
  const totalRecommendations = cardTemplates.reduce(
    (sum, template) => sum + template.recommendations,
    0,
  );
  const totalDownloads = cardTemplates.reduce(
    (sum, template) => sum + template.downloads,
    0,
  );

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-zinc-950">
      <style>{cardTemplates.map(getScopedTemplateCss).join("\n\n")}</style>
      <AppHeader />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <Link
          className="text-sm font-medium text-zinc-500 transition hover:text-teal-700"
          href="/"
        >
          Catalog
        </Link>

        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <Surface className="p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <SectionTitle
                  body="덱 업로더가 앞면 HTML, 뒷면 HTML, 카드 CSS를 선택하거나 참고할 수 있는 템플릿 공유장입니다."
                  eyebrow="Shared Card System"
                  icon={Palette}
                  title="카드 템플릿 공유장"
                />
                <Link
                  className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-700 hover:shadow-sm"
                  href="/upload/"
                >
                  <LayoutTemplate size={17} aria-hidden="true" />
                  업로드에서 사용
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <StatCard
                  icon={LayoutTemplate}
                  label="공유 템플릿"
                  value={cardTemplates.length}
                />
                <StatCard icon={Heart} label="추천 합계" value={totalRecommendations} />
                <StatCard icon={Download} label="사용 합계" value={totalDownloads} />
              </div>
            </Surface>

            <div className="space-y-5">
              {cardTemplates.map((template) => (
                <Surface className="overflow-hidden" key={template.id}>
                  <div className="grid gap-0 xl:grid-cols-[minmax(0,1.02fr)_minmax(380px,0.98fr)]">
                    <div className="p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold leading-7 text-zinc-950">
                              {template.name}
                            </h2>
                            <Badge tone={template.tone === "exam" ? "amber" : "teal"}>
                              {template.author}
                            </Badge>
                          </div>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                            {template.summary}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge tone="zinc">{template.recommendations} 추천</Badge>
                          <Badge tone="zinc">{template.downloads} 사용</Badge>
                        </div>
                      </div>

                      <div className={cx("mt-5", getTemplateScopeClass(template.id))}>
                        <div className="grid gap-4 md:grid-cols-2">
                          <CardTemplatePreview
                            back={sample.back}
                            category={sample.category}
                            deckTitle={sample.deckTitle}
                            extra={sample.extra}
                            front={sample.front}
                            side="front"
                            template={template}
                            version={sample.version}
                          />
                          <CardTemplatePreview
                            back={sample.back}
                            category={sample.category}
                            deckTitle={sample.deckTitle}
                            extra={sample.extra}
                            front={sample.front}
                            side="back"
                            template={template}
                            version={sample.version}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-100 bg-zinc-50 p-5 xl:border-l xl:border-t-0">
                      <div className="grid gap-4">
                        <TemplateCodeBlock
                          code={template.frontHtml}
                          icon={FileCode2}
                          title="앞면 HTML"
                        />
                        <TemplateCodeBlock
                          code={template.backHtml}
                          icon={FileCode2}
                          title="뒷면 HTML"
                        />
                        <TemplateCodeBlock code={template.css} icon={Code2} title="카드 CSS" />
                      </div>
                    </div>
                  </div>
                </Surface>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <Surface className="p-5">
              <SectionTitle
                body="처음 올리는 사용자는 완성된 템플릿을 고르고, 익숙한 사용자는 HTML/CSS를 복사해 자기 덱에 맞게 변형할 수 있습니다."
                eyebrow="Workflow"
                icon={Sparkles}
                title="공유 방식"
              />
              <div className="mt-5">
                <InfoList
                  items={[
                    ["선택 단위", "앞면 HTML + 뒷면 HTML + CSS"],
                    ["권장 구조", "{{Front}}, {{Back}}, {{Extra}} 필드"],
                    ["검수 기준", "모바일 가독성, 외부 리소스 최소화"],
                    ["확장 예정", "사용자 제출, 추천, 신고, 버전 관리"],
                  ]}
                />
              </div>
            </Surface>

            <Surface className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                  <ShieldCheck size={20} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-7 text-zinc-950">
                    안전한 템플릿 규칙
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    공유 템플릿은 인라인 스크립트 없이 HTML 구조와 CSS만 다룹니다.
                    이미지나 폰트 같은 외부 리소스는 검수 후 허용하는 편이 좋습니다.
                  </p>
                </div>
              </div>
            </Surface>
          </aside>
        </div>
      </section>
    </main>
  );
}

function TemplateCodeBlock({
  code,
  icon: Icon,
  title,
}: {
  code: string;
  icon: typeof Code2;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <Icon size={17} className="text-teal-600" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      </div>
      <pre className="mt-3 max-h-48 overflow-auto rounded-md bg-zinc-950 p-3 text-xs leading-5 text-zinc-100">
        <code>{code}</code>
      </pre>
    </section>
  );
}
