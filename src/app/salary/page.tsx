import type { Metadata } from "next";
import SalaryCalculator from "@/components/calculators/SalaryCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://divine-rejoicing-production.up.railway.app";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 2026 - 4대보험, 소득세 자동계산",
  description:
    "2026년 기준 연봉 실수령액 계산기. 국민연금 4.5%, 건강보험 3.545%, 고용보험 0.9%, 소득세를 공제한 월 실수령액을 즉시 계산하세요. 연봉 3000~1억까지 지원.",
  keywords: [
    "연봉 실수령액 계산기",
    "연봉계산기",
    "실수령액",
    "월급 실수령액",
    "4대보험 계산",
    "국민연금 계산",
    "건강보험 계산",
    "고용보험 계산",
    "소득세 계산",
    "2026 연봉 계산기",
    "연봉 5000 실수령",
  ],
  alternates: {
    canonical: `${BASE_URL}/salary`,
    languages: { "ko-KR": `${BASE_URL}/salary` },
  },
  openGraph: {
    title: "연봉 실수령액 계산기 2026 - 4대보험, 소득세 자동계산",
    description: "세전 연봉 입력으로 4대보험, 소득세 공제 후 월 실수령액을 바로 확인하세요. 2026년 최신 기준 적용.",
    type: "website",
    url: `${BASE_URL}/salary`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "연봉 실수령액 계산기 2026",
    description: "세전 연봉 입력으로 4대보험, 소득세 공제 후 월 실수령액을 바로 확인하세요.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/salary`,
      name: "연봉 실수령액 계산기",
      url: `${BASE_URL}/salary`,
      description: "2026년 기준 연봉 실수령액 계산기. 4대보험과 소득세 공제 후 월 실수령액을 계산합니다.",
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
          name: "연봉 5000만원 실수령액은 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "연봉 5000만원의 경우 4대보험(국민연금 4.5%, 건강보험 3.545%, 장기요양 0.9182%, 고용보험 0.9%)과 소득세를 공제하면 월 실수령액은 약 340~360만원 수준입니다. 부양가족 수와 비과세 항목에 따라 달라질 수 있습니다.",
          },
        },
        {
          "@type": "Question",
          name: "2026년 4대보험 요율은 어떻게 되나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "2026년 기준 근로자 부담 4대보험 요율은 국민연금 4.5%, 건강보험 3.545%, 장기요양보험 0.9182%(건강보험료 기준), 고용보험 0.9%입니다.",
          },
        },
        {
          "@type": "Question",
          name: "세전 연봉과 세후 연봉의 차이는 무엇인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "세전 연봉은 4대보험과 소득세를 공제하기 전 금액이고, 세후 연봉(실수령액)은 공제 후 실제 받는 금액입니다. 일반적으로 세전 연봉의 15~25%가 공제됩니다.",
          },
        },
      ],
    },
  ],
};

export default function SalaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          연봉 실수령액 계산기
        </h1>
        <p className="text-gray-500">
          2026년 기준 4대보험과 소득세를 계산해 월 실수령액을 확인하세요.
        </p>
      </div>

      <SalaryCalculator />

      {/* SEO 설명 콘텐츠 */}
      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          2026년 4대보험 요율
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { name: "국민연금", rate: "4.5%", base: "기준소득월액" },
            { name: "건강보험", rate: "3.545%", base: "보수월액" },
            { name: "장기요양", rate: "0.9182%", base: "건강보험료 기준" },
            { name: "고용보험", rate: "0.9%", base: "월 보수액" },
          ].map((item) => (
            <div key={item.name} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="font-medium text-gray-700">{item.name}</p>
              <p className="text-blue-600 font-bold text-lg">{item.rate}</p>
              <p className="text-xs text-gray-400">{item.base}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ 섹션 */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          {[
            {
              q: "연봉 5000만원 실수령액은 얼마인가요?",
              a: "연봉 5000만원의 경우 4대보험과 소득세를 공제하면 월 실수령액은 약 340~360만원 수준입니다. 부양가족 수에 따라 달라질 수 있으니 위 계산기를 직접 사용해 보세요.",
            },
            {
              q: "2026년 4대보험 요율은 어떻게 되나요?",
              a: "2026년 기준 국민연금 4.5%, 건강보험 3.545%, 장기요양 0.9182%(건강보험료 기준), 고용보험 0.9%입니다.",
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
