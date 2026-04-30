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
    slug: "aws-solutions-architect-associate",
    title: "AWS Solutions Architect Associate",
    code: "SAA-C03",
    provider: "AWS",
    examTrack: "Cloud Architecture",
    description:
      "Scenario-heavy cards for resilient architecture, networking, storage, serverless, and cost tradeoffs.",
    tags: ["cloud", "architecture", "aws", "associate"],
    version: "2026.04",
    cards: 486,
    downloads: 1248,
    recommendations: 162,
    status: "Latest",
    accent: "border-teal-500",
    comments: [
      {
        id: "c1",
        author: "min.dev",
        body: "Route 53, ALB, CloudFront 비교 카드가 시험 직전 복습에 좋았습니다.",
        createdAt: "2026-04-26",
        helpfulCount: 18,
      },
      {
        id: "c2",
        author: "sora",
        body: "VPC endpoint 쪽 문제를 조금 더 늘리면 완성도가 더 올라갈 것 같아요.",
        createdAt: "2026-04-24",
        helpfulCount: 9,
      },
    ],
    versions: [
      {
        version: "2026.04",
        publishedAt: "2026-04-27",
        fileSize: "24 MB",
        sha256: "sample-sha256-saa-c03-202604",
        changelog: "Added serverless event flow and cost optimization cards.",
      },
      {
        version: "2026.03",
        publishedAt: "2026-03-18",
        fileSize: "22 MB",
        sha256: "sample-sha256-saa-c03-202603",
        changelog: "Refined networking and storage lifecycle sections.",
      },
    ],
  },
  {
    slug: "aws-sysops-administrator-associate",
    title: "AWS SysOps Administrator Associate",
    code: "SOA-C03",
    provider: "AWS",
    examTrack: "Cloud Operations",
    description:
      "Operational cards for monitoring, incident response, deployment, automation, and security controls.",
    tags: ["cloud", "operations", "aws", "associate"],
    version: "2026.03",
    cards: 392,
    downloads: 734,
    recommendations: 84,
    status: "Stable",
    accent: "border-amber-500",
    comments: [
      {
        id: "c3",
        author: "cloudlog",
        body: "CloudWatch metric math와 alarm action 카드 구성이 실전적입니다.",
        createdAt: "2026-04-20",
        helpfulCount: 11,
      },
    ],
    versions: [
      {
        version: "2026.03",
        publishedAt: "2026-03-29",
        fileSize: "19 MB",
        sha256: "sample-sha256-soa-c03-202603",
        changelog: "Initial reviewed version for SOA-C03.",
      },
    ],
  },
  {
    slug: "google-cloud-associate-cloud-engineer",
    title: "Google Cloud Associate Cloud Engineer",
    code: "ACE",
    provider: "Google Cloud",
    examTrack: "Cloud Foundations",
    description:
      "Foundational GCP cards for IAM, compute, networking, operations, and managed data services.",
    tags: ["cloud", "gcp", "associate", "foundations"],
    version: "2026.02",
    cards: 318,
    downloads: 519,
    recommendations: 57,
    status: "Reviewing",
    accent: "border-sky-500",
    comments: [
      {
        id: "c4",
        author: "jun",
        body: "IAM role 범위와 project/folder/org 구조를 잡는 데 도움이 됐습니다.",
        createdAt: "2026-04-12",
        helpfulCount: 6,
      },
    ],
    versions: [
      {
        version: "2026.02",
        publishedAt: "2026-02-21",
        fileSize: "16 MB",
        sha256: "sample-sha256-ace-202602",
        changelog: "Draft community review release.",
      },
    ],
  },
];

export const providers = ["All", "AWS", "Google Cloud", "Security", "Linux"];

export function getDeckBySlug(slug: string) {
  return decks.find((deck) => deck.slug === slug);
}
