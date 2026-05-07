export type CardTemplateTone = "clinical" | "exam" | "dark";

export type CardTemplate = {
  id: string;
  name: string;
  author: string;
  summary: string;
  tone: CardTemplateTone;
  recommendations: number;
  downloads: number;
  css: string;
  frontHtml: string;
  backHtml: string;
};

export const cardTemplates: CardTemplate[] = [
  {
    id: "clean-review",
    name: "Clean Review",
    author: "DeckHub",
    summary: "자격증 용어와 짧은 답변을 가장 안정적으로 보여주는 기본 템플릿입니다.",
    tone: "clinical",
    recommendations: 148,
    downloads: 932,
    css: `.deckhub-card {
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
}`,
    frontHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">Question</p>
  <h1 class="deckhub-card__question">{{Front}}</h1>
  <footer>{{DeckTitle}} · v{{Version}}</footer>
</div>`,
    backHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">Answer</p>
  <h1 class="deckhub-card__answer">{{Back}}</h1>
  <p class="deckhub-card__note">{{Extra}}</p>
  <footer>{{DeckTitle}} · v{{Version}}</footer>
</div>`,
  },
  {
    id: "exam-contrast",
    name: "Exam Contrast",
    author: "study-lab",
    summary: "공식, 법령, 키워드를 강하게 대비시켜 시험 직전 복습에 맞춘 템플릿입니다.",
    tone: "exam",
    recommendations: 96,
    downloads: 544,
    css: `.deckhub-card {
  min-height: 360px;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  background: #fffbeb;
  color: #1c1917;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.7;
}

.deckhub-card__label {
  color: #b45309;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.deckhub-card__question {
  font-size: 32px;
  font-weight: 900;
}

.deckhub-card__answer {
  font-size: 23px;
  font-weight: 800;
}

.deckhub-card__note {
  border: 1px solid #fde68a;
  background: #ffffff;
  color: #57534e;
}`,
    frontHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">EXAM PROMPT</p>
  <h1 class="deckhub-card__question">{{Front}}</h1>
  <footer>{{Category}} · {{DeckTitle}}</footer>
</div>`,
    backHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">KEY ANSWER</p>
  <h1 class="deckhub-card__answer">{{Back}}</h1>
  <p class="deckhub-card__note">{{Extra}}</p>
  <footer>Updated v{{Version}}</footer>
</div>`,
  },
  {
    id: "night-focus",
    name: "Night Focus",
    author: "late-review",
    summary: "어두운 환경에서 긴 설명형 카드를 읽기 쉽게 만든 다크 템플릿입니다.",
    tone: "dark",
    recommendations: 121,
    downloads: 681,
    css: `.deckhub-card {
  min-height: 360px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #111827;
  color: #f8fafc;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.7;
}

.deckhub-card__label {
  color: #5eead4;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.deckhub-card__question {
  color: #ffffff;
  font-size: 30px;
  font-weight: 850;
}

.deckhub-card__answer {
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
}

.deckhub-card__note {
  border-left: 3px solid #2dd4bf;
  background: #1f2937;
  color: #cbd5e1;
}`,
    frontHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">Focus</p>
  <h1 class="deckhub-card__question">{{Front}}</h1>
  <footer>{{DeckTitle}}</footer>
</div>`,
    backHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">Recall</p>
  <h1 class="deckhub-card__answer">{{Back}}</h1>
  <p class="deckhub-card__note">{{Extra}}</p>
  <footer>{{Version}}</footer>
</div>`,
  },
];

export function getCardTemplateById(id: string) {
  return cardTemplates.find((template) => template.id === id) ?? cardTemplates[0];
}

export function getTemplateScopeClass(id: string) {
  return `deckhub-template-${id}`;
}

export function getScopedTemplateCss(template: CardTemplate) {
  return template.css.replaceAll(
    ".deckhub-card",
    `.${getTemplateScopeClass(template.id)} .deckhub-card`,
  );
}
