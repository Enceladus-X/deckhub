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

const baseFont =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const cardTemplates: CardTemplate[] = [
  {
    id: "clean-review",
    name: "Clean Review",
    author: "DeckHub",
    summary: "A quiet, readable card style for definitions and short answers.",
    tone: "clinical",
    recommendations: 148,
    downloads: 932,
    css: `.deckhub-card {
  min-height: 360px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  background: #ffffff;
  color: #18181b;
  font-family: ${baseFont};
  line-height: 1.65;
  padding: 32px;
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
  padding: 16px;
}`,
    frontHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">Question</p>
  <h1 class="deckhub-card__question">{{Front}}</h1>
  <footer>{{DeckTitle}} - v{{Version}}</footer>
</div>`,
    backHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">Answer</p>
  <h1 class="deckhub-card__answer">{{Back}}</h1>
  <p class="deckhub-card__note">{{Extra}}</p>
  <footer>{{DeckTitle}} - v{{Version}}</footer>
</div>`,
  },
  {
    id: "exam-contrast",
    name: "Exam Contrast",
    author: "DeckHub",
    summary: "A high-contrast layout for formulas, rules, and final review notes.",
    tone: "exam",
    recommendations: 96,
    downloads: 544,
    css: `.deckhub-card {
  min-height: 360px;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  background: #fff7ed;
  color: #1c1917;
  font-family: ${baseFont};
  line-height: 1.65;
  padding: 32px;
}

.deckhub-card__label {
  color: #b45309;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.deckhub-card__question {
  font-size: 30px;
  font-weight: 850;
}

.deckhub-card__answer {
  font-size: 24px;
  font-weight: 850;
}

.deckhub-card__note {
  border: 1px solid #fed7aa;
  background: #ffffff;
  color: #57534e;
  padding: 16px;
}`,
    frontHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">Prompt</p>
  <h1 class="deckhub-card__question">{{Front}}</h1>
  <footer>{{Category}} - {{DeckTitle}}</footer>
</div>`,
    backHtml: `<div class="deckhub-card">
  <p class="deckhub-card__label">Key Answer</p>
  <h1 class="deckhub-card__answer">{{Back}}</h1>
  <p class="deckhub-card__note">{{Extra}}</p>
  <footer>Updated v{{Version}}</footer>
</div>`,
  },
  {
    id: "night-focus",
    name: "Night Focus",
    author: "DeckHub",
    summary: "A dark card style for long evening review sessions.",
    tone: "dark",
    recommendations: 121,
    downloads: 681,
    css: `.deckhub-card {
  min-height: 360px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #111827;
  color: #f8fafc;
  font-family: ${baseFont};
  line-height: 1.7;
  padding: 32px;
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
  padding: 16px;
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
