import type { Metadata } from "next";
import HealthInsuranceCalculator from "@/components/calculators/HealthInsuranceCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://korean-calc.vercel.app";

export const metadata: Metadata = {
  title: "건강보험료 계산기 2026 - 직장·지역 가입자",
  description:
    "건강보험료 계산기. 직장가입자(보수월액 기준)와 지역가입자 건강보험료 및 장기요양보험료를 계산합니다. 2025년 보험료율 7.09% 기준.",
  keywords: [
    "건강보험료 계산기",
    "건강보험료",
    "직장가입자 보험료",
    "지역가입자 보험료",
    "장기요양보험료",
    "건강보험료율",
    "4대보험",
    "2026 건강보험",
    "국민건강보험",
    "보험료 계산",
  ],
  alternates: {
    canonical: `${BASE_URL}/health-insurance`,
    languages: { "ko-KR": `${BASE_URL}/health-insurance` },
  },
  openGraph: {
    title: "건강보험료 계산기 2026",
    description: "직장·지역 가입자 건강보험료와 장기요양보험료를 계산합니다.",
    type: "website",
    url: `${BASE_URL}/health-insurance`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "건강보험료 계산기 2026",
    description: "내 건강보험료와 장기요양보험료를 확인하세요.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/health-insurance`,
      name: "건강보험료 계산기",
      url: `${BASE_URL}/health-insurance`,
      description: "직장·지역 가입자 건강보험료 및 장기요양보험료 계산기.",
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
          name: "건강보험료율은 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "2025년 건강보험료율은 7.09%이며, 직장가입자는 사업주와 근로자가 각각 3.545%씩 부담합니다. 장기요양보험료는 건강보험료의 12.95%가 추가됩니다.",
          },
        },
        {
          "@type": "Question",
          name: "지역가입자 보험료는 어떻게 산정되나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "지역가입자는 소득, 재산(부동산, 자동차 등)을 점수화하여 보험료를 산정합니다. 이 계산기는 소득 기반 간이 계산을 제공합니다.",
          },
        },
      ],
    },
  ],
};

export default function HealthInsurancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          건강보험료 계산기
        </h1>
        <p className="text-gray-500">
          직장가입자·지역가입자 건강보험료와 장기요양보험료를 계산합니다.
        </p>
      </div>

      <HealthInsuranceCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">2025년 건강보험료 기준</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            { title: "건강보험료율", formula: "7.09%", example: "직장: 사업주 3.545% + 본인 3.545%" },
            { title: "장기요양보험료", formula: "건강보험료 × 12.95%", example: "건강보험료에 추가 부과" },
            { title: "직장가입자 계산", formula: "보수월액 × 3.545%", example: "월급 300만원 → 약 10.6만원" },
            { title: "상한선 (2025)", formula: "월 약 391만원", example: "보수월액 상한 기준" },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-1">{item.title}</p>
              <p className="font-mono text-cyan-700 text-sm">{item.formula}</p>
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
              q: "퇴직 후 건강보험은 어떻게 되나요?",
              a: "퇴직하면 지역가입자로 전환됩니다. 단, 퇴직 전 직장가입자 자격을 18개월 이상 유지했다면 임의계속가입(최대 36개월)을 신청하여 직장가입자 보험료를 유지할 수 있습니다.",
            },
            {
              q: "피부양자 자격 기준은 무엇인가요?",
              a: "직장가입자의 배우자, 직계존비속 등이 연소득 2,000만원 이하이고, 재산세 과세표준 5.4억원 이하인 경우 피부양자로 등록하여 보험료 없이 건강보험 혜택을 받을 수 있습니다.",
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
