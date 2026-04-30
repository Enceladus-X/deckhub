export type DeckComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  helpfulCount: number;
};

export type DeckVersion = {
  version: string;
  publishedAt: string;
  fileSize: string;
  sha256: string;
  changelog: string;
};

export type Deck = {
  slug: string;
  title: string;
  code: string;
  provider: string;
  examTrack: string;
  description: string;
  tags: string[];
  version: string;
  cards: number;
  downloads: number;
  recommendations: number;
  comments: DeckComment[];
  versions: DeckVersion[];
  status: "Latest" | "Stable" | "Reviewing";
  accent: string;
};

export const decks: Deck[] = [
  {
    slug: "qnet-engineer-information-processing",
    title: "정보처리기사",
    code: "QNET-1320",
    provider: "IT/정보통신",
    examTrack: "국가기술자격 · 기사",
    description:
      "소프트웨어 설계, 데이터베이스, 프로그래밍 언어, 정보시스템 구축관리 과목을 회독형 카드로 정리한 덱입니다.",
    tags: ["국가기술자격", "기사", "정보처리", "소프트웨어"],
    version: "2026.04",
    cards: 624,
    downloads: 1840,
    recommendations: 231,
    status: "Latest",
    accent: "border-teal-500",
    comments: [
      {
        id: "c1",
        author: "devnote",
        body: "SQL, 정규화, 트랜잭션 카드가 실전 복습에 좋았습니다.",
        createdAt: "2026-04-27",
        helpfulCount: 24,
      },
      {
        id: "c2",
        author: "minji",
        body: "보안 구축관리 파트를 최신 출제기준 기준으로 더 쪼개면 좋겠어요.",
        createdAt: "2026-04-25",
        helpfulCount: 12,
      },
    ],
    versions: [
      {
        version: "2026.04",
        publishedAt: "2026-04-28",
        fileSize: "31 MB",
        sha256: "sample-sha256-qnet-1320-202604",
        changelog: "운영체제, 네트워크, 보안 구축관리 오답 카드를 보강했습니다.",
      },
      {
        version: "2026.03",
        publishedAt: "2026-03-19",
        fileSize: "29 MB",
        sha256: "sample-sha256-qnet-1320-202603",
        changelog: "필기 5과목 핵심 키워드와 빈출 개념 카드를 정리했습니다.",
      },
    ],
  },
  {
    slug: "qnet-engineer-industrial-safety",
    title: "산업안전기사",
    code: "QNET-1431",
    provider: "안전관리",
    examTrack: "국가기술자격 · 기사",
    description:
      "안전관리론, 인간공학, 기계·전기·화학 안전, 건설안전 과목을 사고 사례 중심으로 묶은 덱입니다.",
    tags: ["국가기술자격", "기사", "안전관리", "산업안전"],
    version: "2026.03",
    cards: 548,
    downloads: 1292,
    recommendations: 188,
    status: "Stable",
    accent: "border-amber-500",
    comments: [
      {
        id: "c3",
        author: "safetylog",
        body: "위험성 평가와 보호구 파트가 암기하기 좋게 나뉘어 있습니다.",
        createdAt: "2026-04-21",
        helpfulCount: 18,
      },
    ],
    versions: [
      {
        version: "2026.03",
        publishedAt: "2026-03-31",
        fileSize: "27 MB",
        sha256: "sample-sha256-qnet-1431-202603",
        changelog: "산업재해 예방계획과 안전보건관리체계 카드를 보강했습니다.",
      },
    ],
  },
  {
    slug: "qnet-engineer-electricity",
    title: "전기기사",
    code: "QNET-1150",
    provider: "전기/전자",
    examTrack: "국가기술자격 · 기사",
    description:
      "회로이론, 전력공학, 전기기기, 전기설비기술기준을 공식·개념·계산 유형별로 분리한 덱입니다.",
    tags: ["국가기술자격", "기사", "전기", "계산문제"],
    version: "2026.04",
    cards: 712,
    downloads: 1560,
    recommendations: 205,
    status: "Latest",
    accent: "border-sky-500",
    comments: [
      {
        id: "c4",
        author: "ohm",
        body: "전력공학 송배전 파트가 단답식으로 잘 정리되어 있습니다.",
        createdAt: "2026-04-22",
        helpfulCount: 16,
      },
    ],
    versions: [
      {
        version: "2026.04",
        publishedAt: "2026-04-24",
        fileSize: "34 MB",
        sha256: "sample-sha256-qnet-1150-202604",
        changelog: "전기설비기술기준 조문형 카드를 추가했습니다.",
      },
      {
        version: "2026.02",
        publishedAt: "2026-02-17",
        fileSize: "31 MB",
        sha256: "sample-sha256-qnet-1150-202602",
        changelog: "회로이론 공식 카드와 계산 패턴 카드를 분리했습니다.",
      },
    ],
  },
  {
    slug: "qnet-engineer-architecture",
    title: "건축기사",
    code: "QNET-1630",
    provider: "건축",
    examTrack: "국가기술자격 · 기사",
    description:
      "건축계획, 건축시공, 구조, 설비, 법규를 과목별 체크리스트와 빈출 조문 카드로 구성했습니다.",
    tags: ["국가기술자격", "기사", "건축", "법규"],
    version: "2026.02",
    cards: 436,
    downloads: 701,
    recommendations: 77,
    status: "Reviewing",
    accent: "border-indigo-500",
    comments: [
      {
        id: "c5",
        author: "build-up",
        body: "건축법규 숫자 암기 카드가 짧아서 이동 중 복습하기 좋습니다.",
        createdAt: "2026-04-14",
        helpfulCount: 7,
      },
    ],
    versions: [
      {
        version: "2026.02",
        publishedAt: "2026-02-26",
        fileSize: "22 MB",
        sha256: "sample-sha256-qnet-1630-202602",
        changelog: "건축법규와 구조 공식 카드를 초안으로 공개했습니다.",
      },
    ],
  },
  {
    slug: "qnet-industrial-engineer-electricity",
    title: "전기산업기사",
    code: "QNET-2140",
    provider: "전기/전자",
    examTrack: "국가기술자격 · 산업기사",
    description:
      "전기기초, 전력설비, 전기기기, 설비기준을 산업기사 난도에 맞춰 압축한 실전 회독 덱입니다.",
    tags: ["국가기술자격", "산업기사", "전기", "설비"],
    version: "2026.03",
    cards: 504,
    downloads: 936,
    recommendations: 119,
    status: "Stable",
    accent: "border-cyan-500",
    comments: [
      {
        id: "c6",
        author: "volt",
        body: "전기기사 덱보다 계산 카드가 짧아서 산업기사 준비에 맞습니다.",
        createdAt: "2026-04-18",
        helpfulCount: 10,
      },
    ],
    versions: [
      {
        version: "2026.03",
        publishedAt: "2026-03-23",
        fileSize: "25 MB",
        sha256: "sample-sha256-qnet-2140-202603",
        changelog: "설비기준 빈칸 카드와 전기기기 비교 카드를 추가했습니다.",
      },
    ],
  },
  {
    slug: "qnet-licensed-real-estate-agent",
    title: "공인중개사",
    code: "PRO-08",
    provider: "부동산/관리",
    examTrack: "국가전문자격",
    description:
      "부동산학개론, 민법, 공법, 공시법, 세법, 중개사법을 1차·2차 시험 흐름에 맞춰 분리한 덱입니다.",
    tags: ["국가전문자격", "공인중개사", "부동산", "법령"],
    version: "2026.04",
    cards: 836,
    downloads: 2214,
    recommendations: 318,
    status: "Latest",
    accent: "border-emerald-500",
    comments: [
      {
        id: "c7",
        author: "estate",
        body: "민법 판례 키워드와 중개사법 벌칙 카드가 시험 직전에 유용했습니다.",
        createdAt: "2026-04-23",
        helpfulCount: 31,
      },
      {
        id: "c8",
        author: "haeun",
        body: "공법은 용도지역 비교표형 카드가 더 많아지면 좋겠습니다.",
        createdAt: "2026-04-16",
        helpfulCount: 14,
      },
    ],
    versions: [
      {
        version: "2026.04",
        publishedAt: "2026-04-29",
        fileSize: "42 MB",
        sha256: "sample-sha256-pro-08-202604",
        changelog: "2차 과목 법령 개정 체크 카드와 민법 사례형 카드를 보강했습니다.",
      },
      {
        version: "2026.01",
        publishedAt: "2026-01-30",
        fileSize: "38 MB",
        sha256: "sample-sha256-pro-08-202601",
        changelog: "1차 과목 핵심 개념과 계산 문제 카드를 공개했습니다.",
      },
    ],
  },
  {
    slug: "qnet-certified-labor-attorney",
    title: "공인노무사",
    code: "PRO-05",
    provider: "전문서비스",
    examTrack: "국가전문자격",
    description:
      "노동법, 민법, 사회보험법, 경영학개론을 1차 객관식 회독과 2차 논점 암기에 맞춰 나눈 덱입니다.",
    tags: ["국가전문자격", "공인노무사", "노동법", "사회보험"],
    version: "2026.03",
    cards: 692,
    downloads: 842,
    recommendations: 96,
    status: "Reviewing",
    accent: "border-rose-500",
    comments: [
      {
        id: "c9",
        author: "laborist",
        body: "노동법 조문-판례 연결 카드가 회독용으로 좋습니다.",
        createdAt: "2026-04-10",
        helpfulCount: 9,
      },
    ],
    versions: [
      {
        version: "2026.03",
        publishedAt: "2026-03-15",
        fileSize: "33 MB",
        sha256: "sample-sha256-pro-05-202603",
        changelog: "1차 과목 객관식 오답 포인트와 2차 논점 목차 카드를 추가했습니다.",
      },
    ],
  },
  {
    slug: "qnet-housing-manager",
    title: "주택관리사보",
    code: "PRO-59",
    provider: "부동산/관리",
    examTrack: "국가전문자격",
    description:
      "회계원리, 공동주택시설개론, 민법, 주택관리관계법규, 관리실무를 단원별로 묶은 덱입니다.",
    tags: ["국가전문자격", "주택관리사보", "공동주택", "회계"],
    version: "2026.02",
    cards: 578,
    downloads: 675,
    recommendations: 73,
    status: "Stable",
    accent: "border-lime-500",
    comments: [
      {
        id: "c10",
        author: "apt-care",
        body: "회계원리 분개 카드가 초반 진입장벽을 낮춰줍니다.",
        createdAt: "2026-04-08",
        helpfulCount: 8,
      },
    ],
    versions: [
      {
        version: "2026.02",
        publishedAt: "2026-02-20",
        fileSize: "28 MB",
        sha256: "sample-sha256-pro-59-202602",
        changelog: "시설개론 설비 비교 카드와 회계원리 기초 카드를 정리했습니다.",
      },
    ],
  },
];

export const providers = [
  "전체",
  "IT/정보통신",
  "안전관리",
  "전기/전자",
  "건축",
  "부동산/관리",
  "전문서비스",
];

export function getDeckBySlug(slug: string) {
  return decks.find((deck) => deck.slug === slug);
}
