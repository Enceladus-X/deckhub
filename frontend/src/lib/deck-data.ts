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

export type SampleCard = {
  front: string;
  back: string;
};

export type DeckStatus = "최신" | "안정" | "검토중";
export type ModerationStatus = "공개" | "검토 대기" | "수정 요청";

export type Deck = {
  slug: string;
  title: string;
  aliases: string[];
  code: string;
  category: string;
  examTrack: string;
  subjects: string[];
  description: string;
  sourceName: string;
  sourceUrl: string;
  uploader: string;
  license: string;
  updatedAt: string;
  verifiedAt: string;
  version: string;
  cards: number;
  downloads: number;
  recommendations: number;
  comments: DeckComment[];
  versions: DeckVersion[];
  sampleCards: SampleCard[];
  status: DeckStatus;
  moderationStatus: ModerationStatus;
  qualityScore: number;
  reports: number;
  accent: string;
};

export const decks: Deck[] = [
  {
    slug: "qnet-engineer-information-processing",
    title: "정보처리기사",
    aliases: ["정처기", "정보처리", "software engineer"],
    code: "QNET-1320",
    category: "IT",
    examTrack: "국가기술자격 · 기사",
    subjects: ["소프트웨어 설계", "데이터베이스", "프로그래밍 언어", "정보시스템 구축관리"],
    description:
      "필기 5과목을 기출 개념, 용어, 빈칸 카드로 정리한 덱입니다. 최신 출제기준의 보안, 운영체제, 네트워크 파트를 보강했습니다.",
    sourceName: "Q-Net 공개 출제기준 + 업로더 기출 정리",
    sourceUrl: "https://www.q-net.or.kr/",
    uploader: "devnote",
    license: "커뮤니티 공유 가능",
    updatedAt: "2026-04-28",
    verifiedAt: "2026-04-29",
    version: "2026.04",
    cards: 624,
    downloads: 1840,
    recommendations: 231,
    status: "최신",
    moderationStatus: "공개",
    qualityScore: 94,
    reports: 0,
    accent: "border-teal-500",
    sampleCards: [
      {
        front: "정규화의 목적은?",
        back: "데이터 중복을 줄이고 삽입, 삭제, 갱신 이상을 방지하는 것이다.",
      },
      {
        front: "OSI 7계층 중 라우팅을 담당하는 계층은?",
        back: "네트워크 계층이다.",
      },
    ],
    comments: [
      {
        id: "c1",
        author: "devnote",
        body: "SQL, 정규화, 트랜잭션 카드가 실전 복습에 좋습니다.",
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
        sha256: "8d3f-sample-qnet-1320-202604",
        changelog: "운영체제, 네트워크, 보안 구축관리 오답 카드를 보강했습니다.",
      },
      {
        version: "2026.03",
        publishedAt: "2026-03-19",
        fileSize: "29 MB",
        sha256: "6a12-sample-qnet-1320-202603",
        changelog: "필기 5과목 핵심 키워드와 빈출 개념 카드를 정리했습니다.",
      },
    ],
  },
  {
    slug: "qnet-engineer-industrial-safety",
    title: "산업안전기사",
    aliases: ["산안기", "산업안전", "safety"],
    code: "QNET-1431",
    category: "안전",
    examTrack: "국가기술자격 · 기사",
    subjects: ["안전관리론", "인간공학", "기계안전", "전기안전", "건설안전"],
    description:
      "법령, 위험성평가, 보호구, 재해예방 공식을 빠르게 반복할 수 있도록 구성한 필기 덱입니다.",
    sourceName: "Q-Net 출제기준 + 안전보건공단 공개자료",
    sourceUrl: "https://www.q-net.or.kr/",
    uploader: "safetylog",
    license: "커뮤니티 공유 가능",
    updatedAt: "2026-03-31",
    verifiedAt: "2026-04-02",
    version: "2026.03",
    cards: 548,
    downloads: 1292,
    recommendations: 188,
    status: "안정",
    moderationStatus: "공개",
    qualityScore: 89,
    reports: 1,
    accent: "border-amber-500",
    sampleCards: [
      {
        front: "위험성평가의 핵심 단계는?",
        back: "유해위험요인 파악, 위험성 결정, 감소대책 수립 및 실행이다.",
      },
      {
        front: "TBM은 무엇의 약자인가?",
        back: "Tool Box Meeting. 작업 전 위험요인을 공유하는 안전 회의다.",
      },
    ],
    comments: [
      {
        id: "c3",
        author: "safetylog",
        body: "위험성평가와 보호구 파트가 외우기 좋게 나뉘어 있습니다.",
        createdAt: "2026-04-21",
        helpfulCount: 18,
      },
    ],
    versions: [
      {
        version: "2026.03",
        publishedAt: "2026-03-31",
        fileSize: "27 MB",
        sha256: "42bc-sample-qnet-1431-202603",
        changelog: "산업재해 예방계획과 안전보건관리체계 카드를 보강했습니다.",
      },
    ],
  },
  {
    slug: "qnet-engineer-electricity",
    title: "전기기사",
    aliases: ["전기", "전기기사 필기", "electricity"],
    code: "QNET-1150",
    category: "전기",
    examTrack: "국가기술자격 · 기사",
    subjects: ["회로이론", "전력공학", "전기기기", "전기설비기술기준"],
    description:
      "공식, 단위, 계산 패턴을 문제 유형별로 나눠 암기할 수 있는 전기기사 필기 덱입니다.",
    sourceName: "Q-Net 출제기준 + 업로더 계산 노트",
    sourceUrl: "https://www.q-net.or.kr/",
    uploader: "ohm",
    license: "커뮤니티 공유 가능",
    updatedAt: "2026-04-24",
    verifiedAt: "2026-04-26",
    version: "2026.04",
    cards: 712,
    downloads: 1560,
    recommendations: 205,
    status: "최신",
    moderationStatus: "공개",
    qualityScore: 91,
    reports: 0,
    accent: "border-sky-500",
    sampleCards: [
      {
        front: "3상 유효전력 공식은?",
        back: "P = √3VIcosθ 이다.",
      },
      {
        front: "역률 개선의 대표 효과는?",
        back: "전류 감소, 전압강하 감소, 설비용량 여유 증가다.",
      },
    ],
    comments: [
      {
        id: "c4",
        author: "ohm",
        body: "전력공학 계산 파트가 오답 중심으로 잘 정리되어 있습니다.",
        createdAt: "2026-04-22",
        helpfulCount: 16,
      },
    ],
    versions: [
      {
        version: "2026.04",
        publishedAt: "2026-04-24",
        fileSize: "34 MB",
        sha256: "a91d-sample-qnet-1150-202604",
        changelog: "전기설비기술기준 조문형 카드를 추가했습니다.",
      },
      {
        version: "2026.02",
        publishedAt: "2026-02-17",
        fileSize: "31 MB",
        sha256: "c77e-sample-qnet-1150-202602",
        changelog: "회로이론 공식 카드와 계산 패턴 카드를 분리했습니다.",
      },
    ],
  },
  {
    slug: "qnet-industrial-engineer-electricity",
    title: "전기산업기사",
    aliases: ["전산기", "전기산기"],
    code: "QNET-2140",
    category: "전기",
    examTrack: "국가기술자격 · 산업기사",
    subjects: ["전기자기학", "전력공학", "전기기기", "회로이론"],
    description:
      "산업기사 난도에 맞춘 전기 기초, 설비 기준, 계산 빈출 카드를 묶은 덱입니다.",
    sourceName: "Q-Net 출제기준",
    sourceUrl: "https://www.q-net.or.kr/",
    uploader: "volt",
    license: "커뮤니티 공유 가능",
    updatedAt: "2026-03-23",
    verifiedAt: "2026-03-25",
    version: "2026.03",
    cards: 504,
    downloads: 936,
    recommendations: 119,
    status: "안정",
    moderationStatus: "공개",
    qualityScore: 84,
    reports: 0,
    accent: "border-cyan-500",
    sampleCards: [
      {
        front: "전압강하율을 낮추는 방법은?",
        back: "전선 단면적 증가, 역률 개선, 송전거리 단축 등이 있다.",
      },
      {
        front: "직류기의 전기자 반작용이란?",
        back: "전기자 전류에 의한 자속이 주자속을 왜곡시키는 현상이다.",
      },
    ],
    comments: [
      {
        id: "c5",
        author: "volt",
        body: "전기기사 덱보다 계산 카드가 적어 산업기사 준비에 맞습니다.",
        createdAt: "2026-04-18",
        helpfulCount: 10,
      },
    ],
    versions: [
      {
        version: "2026.03",
        publishedAt: "2026-03-23",
        fileSize: "25 MB",
        sha256: "71aa-sample-qnet-2140-202603",
        changelog: "설비기준 빈칸 카드와 전기기기 비교 카드를 추가했습니다.",
      },
    ],
  },
  {
    slug: "qnet-engineer-civil",
    title: "토목기사",
    aliases: ["토목", "civil"],
    code: "QNET-1250",
    category: "토목",
    examTrack: "국가기술자격 · 기사",
    subjects: ["응용역학", "측량학", "수리수문학", "철근콘크리트", "토질"],
    description:
      "공식과 단위가 많은 토목기사 필기를 과목별 체크리스트와 계산 카드로 정리했습니다.",
    sourceName: "Q-Net 출제기준 + 업로더 공식 노트",
    sourceUrl: "https://www.q-net.or.kr/",
    uploader: "civilnote",
    license: "커뮤니티 공유 가능",
    updatedAt: "2026-04-18",
    verifiedAt: "2026-04-20",
    version: "2026.04",
    cards: 586,
    downloads: 804,
    recommendations: 104,
    status: "검토중",
    moderationStatus: "공개",
    qualityScore: 78,
    reports: 2,
    accent: "border-orange-500",
    sampleCards: [
      {
        front: "휨응력 기본식은?",
        back: "σ = My / I 이다.",
      },
      {
        front: "다짐곡선에서 최적함수비란?",
        back: "건조밀도가 최대가 되는 함수비다.",
      },
    ],
    comments: [
      {
        id: "c6",
        author: "civilnote",
        body: "토질 공식 카드와 수리수문 단위 변환 카드가 유용합니다.",
        createdAt: "2026-04-17",
        helpfulCount: 11,
      },
    ],
    versions: [
      {
        version: "2026.04",
        publishedAt: "2026-04-18",
        fileSize: "30 MB",
        sha256: "de53-sample-qnet-1250-202604",
        changelog: "응용역학 계산 패턴과 토질 핵심 공식을 추가했습니다.",
      },
    ],
  },
  {
    slug: "qnet-engineer-construction-materials",
    title: "건설재료시험기사",
    aliases: ["건재기", "건설재료", "materials"],
    code: "QNET-1260",
    category: "토목",
    examTrack: "국가기술자격 · 기사",
    subjects: ["콘크리트", "아스팔트", "토질재료", "품질관리"],
    description:
      "재료별 시험 기준, 품질관리 용어, 수치 기준을 반복 학습할 수 있게 만든 덱입니다.",
    sourceName: "Q-Net 출제기준",
    sourceUrl: "https://www.q-net.or.kr/",
    uploader: "material-lab",
    license: "커뮤니티 공유 가능",
    updatedAt: "2026-02-22",
    verifiedAt: "2026-02-24",
    version: "2026.02",
    cards: 402,
    downloads: 512,
    recommendations: 64,
    status: "안정",
    moderationStatus: "공개",
    qualityScore: 80,
    reports: 0,
    accent: "border-stone-500",
    sampleCards: [
      {
        front: "슬럼프 시험의 목적은?",
        back: "아직 굳지 않은 콘크리트의 워커빌리티를 평가한다.",
      },
      {
        front: "골재의 조립률이 의미하는 것은?",
        back: "골재 입도 분포의 굵고 가는 정도를 나타내는 지표다.",
      },
    ],
    comments: [
      {
        id: "c7",
        author: "material-lab",
        body: "압축강도와 입도시험 판정 기준 카드가 보기 좋습니다.",
        createdAt: "2026-04-11",
        helpfulCount: 6,
      },
    ],
    versions: [
      {
        version: "2026.02",
        publishedAt: "2026-02-22",
        fileSize: "21 MB",
        sha256: "93bb-sample-qnet-1260-202602",
        changelog: "건설재료별 시험 기준과 품질관리 용어 카드를 정리했습니다.",
      },
    ],
  },
  {
    slug: "qnet-engineer-architecture",
    title: "건축기사",
    aliases: ["건축", "architecture"],
    code: "QNET-1630",
    category: "건축",
    examTrack: "국가기술자격 · 기사",
    subjects: ["건축계획", "건축시공", "건축구조", "건축설비", "건축법규"],
    description:
      "건축기사 필기 5과목을 조문, 구조 공식, 시공 순서 중심으로 분류한 덱입니다.",
    sourceName: "Q-Net 출제기준 + 업로더 법규 노트",
    sourceUrl: "https://www.q-net.or.kr/",
    uploader: "build-up",
    license: "커뮤니티 공유 가능",
    updatedAt: "2026-02-26",
    verifiedAt: "2026-03-01",
    version: "2026.02",
    cards: 436,
    downloads: 701,
    recommendations: 77,
    status: "검토중",
    moderationStatus: "공개",
    qualityScore: 76,
    reports: 1,
    accent: "border-indigo-500",
    sampleCards: [
      {
        front: "피난계단 설치 기준은 어디서 확인하는가?",
        back: "건축법령과 건축물의 피난·방화구조 기준에서 확인한다.",
      },
      {
        front: "철근콘크리트 보의 전단보강근 역할은?",
        back: "전단균열을 억제하고 전단내력을 보강한다.",
      },
    ],
    comments: [
      {
        id: "c8",
        author: "build-up",
        body: "건축법규 숫자 암기 카드가 이동 중 복습하기 좋습니다.",
        createdAt: "2026-04-14",
        helpfulCount: 7,
      },
    ],
    versions: [
      {
        version: "2026.02",
        publishedAt: "2026-02-26",
        fileSize: "22 MB",
        sha256: "105e-sample-qnet-1630-202602",
        changelog: "건축법규와 구조 공식 카드를 초안으로 공개했습니다.",
      },
    ],
  },
  {
    slug: "qnet-licensed-real-estate-agent",
    title: "공인중개사",
    aliases: ["공중사", "부동산", "real estate"],
    code: "PRO-08",
    category: "부동산",
    examTrack: "국가전문자격",
    subjects: ["부동산학개론", "민법", "공법", "공시법", "세법", "중개사법"],
    description:
      "1차와 2차 과목을 법령 개정 체크, 판례 키워드, 계산 문제 카드로 나눈 대용량 덱입니다.",
    sourceName: "Q-Net 공개정보 + 업로더 법령 체크리스트",
    sourceUrl: "https://www.q-net.or.kr/",
    uploader: "estate",
    license: "커뮤니티 공유 가능",
    updatedAt: "2026-04-29",
    verifiedAt: "2026-04-30",
    version: "2026.04",
    cards: 836,
    downloads: 2214,
    recommendations: 318,
    status: "최신",
    moderationStatus: "공개",
    qualityScore: 96,
    reports: 0,
    accent: "border-emerald-500",
    sampleCards: [
      {
        front: "민법상 착오 취소의 요건은?",
        back: "법률행위 내용의 중요 부분에 착오가 있어야 하며 중대한 과실이 없어야 한다.",
      },
      {
        front: "중개대상물 확인·설명서의 성격은?",
        back: "개업공인중개사가 거래당사자에게 대상물의 권리·상태를 설명하는 문서다.",
      },
    ],
    comments: [
      {
        id: "c9",
        author: "estate",
        body: "민법 판례 키워드와 중개사법 벌칙 카드가 시험 직전 유용했습니다.",
        createdAt: "2026-04-23",
        helpfulCount: 31,
      },
      {
        id: "c10",
        author: "haeun",
        body: "공법은 용도지역 비교형 카드가 더 많아지면 좋겠습니다.",
        createdAt: "2026-04-16",
        helpfulCount: 14,
      },
    ],
    versions: [
      {
        version: "2026.04",
        publishedAt: "2026-04-29",
        fileSize: "42 MB",
        sha256: "f12a-sample-pro-08-202604",
        changelog: "2차 과목 법령 개정 체크 카드와 민법 판례 카드를 보강했습니다.",
      },
      {
        version: "2026.01",
        publishedAt: "2026-01-30",
        fileSize: "38 MB",
        sha256: "0b98-sample-pro-08-202601",
        changelog: "1차 과목 핵심 개념과 계산 문제 카드를 공개했습니다.",
      },
    ],
  },
];

export const categories = ["전체", "IT", "전기", "토목", "건축", "안전", "부동산"];

export const reviewQueue = [
  {
    id: "upload-20260501-001",
    title: "정보보안기사 필기 요약 덱",
    category: "IT",
    uploader: "sec-study",
    fileName: "security-engineer-2026.apkg",
    fileSize: "18 MB",
    submittedAt: "2026-05-01 09:20",
    risk: "중간",
    checks: ["확장자 확인", "SHA256 생성", "출처 링크 필요"],
  },
  {
    id: "upload-20260501-002",
    title: "소방설비기사 전기분야",
    category: "안전",
    uploader: "fire-note",
    fileName: "fire-electric-anki.apkg",
    fileSize: "24 MB",
    submittedAt: "2026-05-01 10:05",
    risk: "낮음",
    checks: ["확장자 확인", "중복 파일 없음", "샘플 카드 적정"],
  },
];

export function getDeckBySlug(slug: string) {
  return decks.find((deck) => deck.slug === slug);
}

export function getDeckStats() {
  return {
    totalDecks: decks.length,
    totalCards: decks.reduce((sum, deck) => sum + deck.cards, 0),
    totalDownloads: decks.reduce((sum, deck) => sum + deck.downloads, 0),
    pendingReviews: reviewQueue.length,
  };
}
