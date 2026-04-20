import type { Metadata } from "next";
import YearEndTaxCalculator from "@/components/calculators/YearEndTaxCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://korean-calc.vercel.app";

export const metadata: Metadata = {
  title: "연말정산 계산기 2026 - 예상 환급액·추가납부액",
  description:
    "연말정산 계산기. 총급여, 소득공제(신용카드, 의료비, 교육비), 세액공제를 반영하여 예상 환급액 또는 추가 납부액을 계산합니다.",
  keywords: [
    "연말정산 계산기",
    "연말정산 환급",
    "소득공제",
    "세액공제",
    "신용카드 공제",
    "의료비 공제",
    "교육비 공제",
    "연말정산 2026",
    "13월의 월급",
    "근로소득세",
  ],
  alternates: {
    canonical: `${BASE_URL}/year-end-tax`,
    languages: { "ko-KR": `${BASE_URL}/year-end-tax` },
  },
  openGraph: {
    title: "연말정산 계산기 2026",
    description: "소득공제·세액공제를 반영한 연말정산 예상 환급액을 계산합니다.",
    type: "website",
    url: `${BASE_URL}/year-end-tax`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "연말정산 계산기 2026",
    description: "연말정산 예상 환급액을 미리 확인하세요.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/year-end-tax`,
      name: "연말정산 계산기",
      url: `${BASE_URL}/year-end-tax`,
      description: "연말정산 예상 환급액·추가납부액 계산기. 소득공제, 세액공제 반영.",
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
          name: "연말정산은 언제 하나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "연말정산은 매년 1~2월에 진행됩니다. 회사에서 근로소득 간이세액표에 따라 원천징수한 세금과 실제 내야 할 세금의 차액을 정산합니다.",
          },
        },
        {
          "@type": "Question",
          name: "신용카드 소득공제는 어떻게 계산되나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "총급여의 25%를 초과 사용한 금액에 대해 공제됩니다. 신용카드는 15%, 체크카드·현금영수증은 30%, 전통시장·대중교통은 40% 공제율이 적용됩니다.",
          },
        },
      ],
    },
  ],
};

export default function YearEndTaxPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          연말정산 계산기
        </h1>
        <p className="text-gray-500">
          소득공제·세액공제를 반영하여 예상 환급액 또는 추가 납부액을 계산합니다.
        </p>
      </div>

      <YearEndTaxCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">연말정산 흐름</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            { title: "1단계", formula: "총급여 - 근로소득공제", example: "= 근로소득금액" },
            { title: "2단계", formula: "근로소득금액 - 소득공제", example: "= 과세표준" },
            { title: "3단계", formula: "과세표준 × 세율", example: "= 산출세액" },
            { title: "4단계", formula: "산출세액 - 세액공제", example: "= 결정세액" },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-1">{item.title}</p>
              <p className="font-mono text-amber-700 text-sm">{item.formula}</p>
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
              q: "연말정산에서 환급을 많이 받으려면?",
              a: "신용카드보다 체크카드·현금영수증 비율을 높이면 공제율이 높습니다(30% vs 15%). 또한 연금저축(최대 400만원), IRP(최대 700만원) 세액공제를 활용하세요.",
            },
            {
              q: "맞벌이 부부의 공제 전략은?",
              a: "소득이 높은 배우자에게 인적공제를 몰아주는 것이 유리합니다. 단, 의료비는 총급여의 3% 초과분만 공제되므로 소득이 낮은 쪽에서 신청하는 것이 더 유리할 수 있습니다.",
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
