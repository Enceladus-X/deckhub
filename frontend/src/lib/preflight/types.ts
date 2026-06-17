export type IssueSeverity = "error" | "warning" | "info";

export type IssueType =
  | "field_broken"
  | "choice_dependent"
  | "negative_trace"
  | "incomplete_ox_statement"
  | "long_front"
  | "long_ox_front"
  | "long_back"
  | "heavy_list"
  | "numeric_no_unit"
  | "count_mismatch"
  | "vague_front"
  | "weak_axis"
  | "duplicate_front"
  | "manual_review";

export type ReviewReason =
  | "질문 축 수정 필요"
  | "정답 과다/과소"
  | "문체/오타"
  | "용어 설명 필요"
  | "원본 대조 필요"
  | "이미지/표 의존"
  | "삭제 후보";

export type DeckProfile = {
  id: string;
  name: string;
  description: string;
  expectedFields: number;
  subjectPattern?: RegExp;
  choiceDependentTokens: string[];
  negativeTokens: string[];
  vagueFrontTokens: string[];
  clearAxisTokens: string[];
};

export type ParsedCard = {
  id: string;
  lineNo: number;
  raw: string;
  fields: string[];
  ref: string;
  front: string;
  back: string;
  extra: string;
  subject?: string;
};

export type SourceFingerprint = {
  hash: string;
  nonEmptyLines: number;
  firstRef: string;
  lastRef: string;
};

export type PreflightIssue = {
  id: string;
  cardId: string;
  lineNo: number;
  type: IssueType;
  severity: IssueSeverity;
  title: string;
  detail: string;
  ref: string;
  front: string;
  back: string;
  extra: string;
  suggestion?: string;
};

export type PreflightReport = {
  profileId: string;
  sourceName: string;
  sourceFingerprint: SourceFingerprint;
  totalLines: number;
  totalCards: number;
  validCards: number;
  issueRecords: number;
  subjectCounts: Record<string, number>;
  issueCounts: Record<IssueType, number>;
  severityCounts: Record<IssueSeverity, number>;
  cards: ParsedCard[];
  issues: PreflightIssue[];
};

export const reviewReasons: ReviewReason[] = [
  "질문 축 수정 필요",
  "정답 과다/과소",
  "문체/오타",
  "용어 설명 필요",
  "원본 대조 필요",
  "이미지/표 의존",
  "삭제 후보",
];
