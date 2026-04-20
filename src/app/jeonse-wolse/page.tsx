import type { Metadata } from "next";
import JeonseWolseCalculator from "@/components/calculators/JeonseWolseCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://korean-calc.vercel.app";

export const metadata: Metadata = {
  title: "전월세 전환 계산기 2026 - 전세 월세 환산",
  description:
    "전월세 전환 계산기. 전세금을 월세로, 월세를 전세 환산금으로 변환합니다. 법정 전환율(2.5%) 기준 및 사용자 지정 전환율 지원.",
  keywords: [
    "전월세 전환 계산기",
    "전세 월세 전환",
    "전환율 계산",
    "법정 전환율",
    "월세 전세 환산",
    "보증금 월세",
    "전세금 월세",
    "2026 전월세",
    "임대차 계산",
    "월세 계산기",
  ],
  alternates: {
    canonical: `${BASE_URL}/jeonse-wolse`,
    languages: { "ko-KR": `${BASE_URL}/jeonse-wolse` },
  },
  openGraph: {
    title: "전월세 전환 계산기 2026",
    description: "전세 ↔ 월세 전환 계산. 법정 전환율 기준 자동 계산.",
    type: "website",
    url: `${BASE_URL}/jeonse-wolse`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "전월세 전환 계산기 2026",
    description: "전세금과 월세를 상호 전환하고 적정 월세를 계산하세요.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/jeonse-wolse`,
      name: "전월세 전환 계산기",
      url: `${BASE_URL}/jeonse-wolse`,
      description: "전세금과 월세를 법정 전환율 기준으로 상호 전환하는 계산기.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "ko-KR",
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "법정 전환율이란 무엇인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "법정 전환율은 전세보증금을 월세로 전환할 때 적용하는 이율로, 한국은행 기준금리 + 2%입니다. 2025년 기준 약 2.5%이며, 임대인은 이 비율을 초과하여 전환할 수 없습니다.",
          },
        },
        {
          "@type": "Question",
          name: "전세 3억을 월세로 전환하면 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "보증금 없이 법정 전환율 2.5% 기준으로 전환하면 연간 750만원, 월 약 62.5만원입니다. 보증금을 일부 유지하면 월세는 그만큼 줄어듭니다.",
          },
        },
      ],
    },
  ],
};

export default function JeonseWolsePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          전월세 전환 계산기
        </h1>
        <p className="text-gray-500">
          전세금 ↔ 월세 상호 전환 및 적정 월세를 계산합니다.
        </p>
      </div>

      <JeonseWolseCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">전월세 전환 공식</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            {
              title: "전세 → 월세",
              formula: "(전세금 - 보증금) × 전환율 ÷ 12",
              example: "(3억 - 1억) × 2.5% ÷ 12 = 41.7만원",
            },
            {
              title: "월세 → 전세",
              formula: "보증금 + (월세 × 12 ÷ 전환율)",
              example: "1억 + (50만 × 12 ÷ 2.5%) = 3.4억",
            },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-1">{item.title}</p>
              <p className="font-mono text-sky-700 text-sm">{item.formula}</p>
              <p className="text-xs text-gray-400 mt-1">{item.example}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          {[
            {
              q: "임대인이 법정 전환율보다 높은 비율로 전환할 수 있나요?",
              a: "아닙니다. 주택임대차보호법에 따라 임대인은 법정 전환율(기준금리 + 2%)을 초과하여 전환할 수 없습니다. 초과분은 무효입니다.",
            },
            {
              q: "전세에서 반전세로 전환 시 주의할 점은?",
              a: "전환 시 보증금 감소분에 대한 월세가 법정 전환율을 초과하지 않는지 확인하세요. 또한 임대차 계약서를 반드시 변경하고 확정일자를 다시 받아야 합니다.",
            },
          ].map((item, i) => (
            <details key={i} className="border border-gray-100 rounded-lg p-4">
              <summary className="font-medium text-gray-700 cursor-pointer">{item.q}</summary>
              <p className="mt-2 text-sm text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
