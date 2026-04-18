import type { Metadata } from "next";
import SeveranceCalculator from "@/components/calculators/SeveranceCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://korean-calc.vercel.app";

export const metadata: Metadata = {
  title: "퇴직금 계산기 2026 - 근속연수별 퇴직금 자동계산",
  description:
    "2026년 근로기준법 기준 퇴직금 계산기. 입사일·퇴사일·월평균임금 입력으로 퇴직금을 즉시 계산하세요. 상여금, 연차수당 포함 계산 지원.",
  keywords: [
    "퇴직금 계산기",
    "퇴직금 계산",
    "퇴직금 얼마",
    "근속연수 퇴직금",
    "평균임금 계산",
    "퇴직금 공식",
    "2026 퇴직금",
    "퇴직금 산정",
    "법정퇴직금",
  ],
  alternates: {
    canonical: `${BASE_URL}/severance`,
    languages: { "ko-KR": `${BASE_URL}/severance` },
  },
  openGraph: {
    title: "퇴직금 계산기 2026 - 근속연수별 퇴직금 자동계산",
    description: "입사일·퇴사일·월평균임금 입력만으로 법정 퇴직금을 즉시 계산하세요.",
    type: "website",
    url: `${BASE_URL}/severance`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "퇴직금 계산기 2026",
    description: "근속연수와 평균임금으로 법정 퇴직금을 자동 계산합니다.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/severance`,
      name: "퇴직금 계산기",
      url: `${BASE_URL}/severance`,
      description: "2026년 근로기준법 기준 퇴직금 계산기. 입사일, 퇴사일, 월 평균임금으로 퇴직금을 계산합니다.",
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
          name: "퇴직금 계산 공식은 무엇인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365). 1일 평균임금은 퇴직 전 3개월간 임금총액을 해당 기간 일수(91일)로 나눈 금액입니다.",
          },
        },
        {
          "@type": "Question",
          name: "퇴직금을 받으려면 얼마나 일해야 하나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "근로기준법상 퇴직금은 계속근로기간이 1년 이상이고 주 15시간 이상 근무한 근로자에게 지급됩니다.",
          },
        },
        {
          "@type": "Question",
          name: "상여금도 퇴직금 계산에 포함되나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "네, 3개월 이전에 지급된 상여금은 3/12를 평균임금에 산입합니다. 연간 상여금 합계의 25%가 평균임금 계산에 반영됩니다.",
          },
        },
      ],
    },
  ],
};

export default function SeverancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          퇴직금 계산기
        </h1>
        <p className="text-gray-500">
          2026년 근로기준법 기준으로 법정 퇴직금을 계산합니다.
        </p>
      </div>

      <SeveranceCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          퇴직금 계산 방법
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-700 mb-1">퇴직금 공식</p>
            <p className="font-mono text-teal-700">퇴직금 = 1일 평균임금 × 30일 × 근속연수</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-700 mb-1">1일 평균임금 계산</p>
            <p className="font-mono text-teal-700">(3개월 임금 + 상여금 × 3/12 + 연차수당 × 3/12) ÷ 91일</p>
          </div>
          <p className="text-xs text-gray-400">
            * 주 15시간 이상, 1년 이상 계속 근로한 모든 근로자에게 지급 의무가 있습니다.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          {[
            {
              q: "퇴직금을 받으려면 최소 얼마나 근무해야 하나요?",
              a: "1년(365일) 이상 계속 근로해야 하며, 주 15시간 이상 근무해야 합니다. 근로기간 중 출산휴가, 육아휴직 등은 계속근로기간에 포함됩니다.",
            },
            {
              q: "퇴직금은 언제 지급해야 하나요?",
              a: "퇴직일로부터 14일 이내에 지급해야 합니다. 당사자 합의 시 연장이 가능하지만, 미지급 시 사업주는 법적 제재를 받을 수 있습니다.",
            },
            {
              q: "퇴직연금(DC형)과 법정퇴직금의 차이는?",
              a: "DC(확정기여형) 퇴직연금은 회사가 매년 연간 임금의 1/12 이상을 개인 계좌에 납입하는 방식입니다. DB(확정급여형)는 법정퇴직금과 동일하게 계산됩니다.",
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
