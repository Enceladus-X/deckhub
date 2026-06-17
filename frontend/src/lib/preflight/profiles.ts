import type { DeckProfile } from "./types";

export const defaultAnkiTxtProfile: DeckProfile = {
  id: "default-anki-txt",
  name: "기본 Anki TXT",
  description:
    "세미콜론으로 구분된 Anki 텍스트 덱을 일반 규칙으로 검사합니다.",
  expectedFields: 4,
  choiceDependentTokens: [
    "다음 중",
    "다음중",
    "보기",
    "제시",
    "고른",
    "옳은 것은",
    "옳은 것을",
    "틀린 것은",
    "적절한 것은",
    "적합한 것은",
    "가장 관련",
    "가장 적합",
    "가장 적절",
  ],
  negativeTokens: [
    "해당하지 않는",
    "볼 수 없는",
    "옳지 않은",
    "틀린",
    "적합하지",
    "적절하지",
    "관련 없는",
  ],
  vagueFrontTokens: [
    "사항은?",
    "내용은?",
    "방법은?",
    "기준은?",
    "요령은?",
    "대책은?",
    "조치는?",
  ],
  clearAxisTokens: [
    "정의",
    "의미",
    "공식",
    "계산",
    "순서",
    "분류",
    "종류",
    "구분",
    "기준값",
    "위치",
    "조건",
    "원인",
    "원칙",
    "단계",
    "방호장치",
    "설치",
    "요건",
    "조치",
    "방법",
    "대책",
    "해당하는",
  ],
};

export const industrialSafetyProfile: DeckProfile = {
  ...defaultAnkiTxtProfile,
  id: "industrial-safety-engineer",
  name: "산업안전기사 개념카드",
  description:
    "출처 필드의 과목 정보, OX 문장, 보기 의존 객관식 흔적을 산업안전기사 덱 기준으로 검사합니다.",
  subjectPattern: /([1-6])과목\s*:\s*([^\]]+)/,
};

export const preflightProfiles = [
  industrialSafetyProfile,
  defaultAnkiTxtProfile,
] as const;

export function getPreflightProfile(profileId: string): DeckProfile {
  return (
    preflightProfiles.find((profile) => profile.id === profileId) ??
    industrialSafetyProfile
  );
}
