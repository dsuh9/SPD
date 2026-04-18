import type { Metadata } from "next";
import CapitalGainsCalculator from "@/components/calculators/CapitalGainsCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://taxcalc.kr";

export const metadata: Metadata = {
  title: "양도소득세 계산기 2026 - 1세대1주택 비과세 자동판단",
  description:
    "2026년 양도소득세 계산기. 1세대1주택 비과세 자동 판단, 장기보유특별공제 적용, 다주택자 중과세율 반영. 부동산 매도 전 양도세를 미리 계산하세요.",
  keywords: [
    "양도소득세 계산기",
    "양도세 계산기",
    "1세대1주택 비과세",
    "장기보유특별공제",
    "부동산 양도세",
    "다주택자 양도세",
    "2026 양도소득세",
    "1가구 2주택 양도소득세",
    "양도소득세 계산",
  ],
  alternates: {
    canonical: `${BASE_URL}/realestate/capital-gains`,
    languages: { "ko-KR": `${BASE_URL}/realestate/capital-gains` },
  },
  openGraph: {
    title: "양도소득세 계산기 2026 - 비과세 자동 판단",
    description: "부동산 양도소득세를 계산하세요. 1세대1주택 비과세, 장기보유특별공제 자동 적용.",
    type: "website",
    url: `${BASE_URL}/realestate/capital-gains`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "양도소득세 계산기 2026",
    description: "1세대1주택 비과세 자동 판단, 장기보유특별공제 자동 적용.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/realestate/capital-gains`,
      name: "양도소득세 계산기",
      url: `${BASE_URL}/realestate/capital-gains`,
      description: "2026년 양도소득세 계산기. 1세대1주택 비과세 자동 판단, 장기보유특별공제 적용.",
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
          name: "1세대1주택 비과세 조건은 무엇인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "1세대1주택 비과세는 2년 이상 보유 및 거주(조정대상지역)하고 양도가액이 12억 원 이하인 경우 적용됩니다. 12억 초과분에 대해서는 과세됩니다.",
          },
        },
        {
          "@type": "Question",
          name: "1가구 2주택 양도소득세율은 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "조정대상지역 내 2주택자는 기본세율에 20%포인트 중과가 적용됩니다. 비조정지역은 기본세율을 적용합니다.",
          },
        },
        {
          "@type": "Question",
          name: "장기보유특별공제란 무엇인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "장기보유특별공제는 3년 이상 보유한 부동산에 적용되는 공제입니다. 1세대1주택은 최대 80%(보유+거주 각 40%), 일반 부동산은 최대 30%까지 공제됩니다.",
          },
        },
      ],
    },
  ],
};

export default function CapitalGainsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          양도소득세 계산기
        </h1>
        <p className="text-gray-500">
          2026년 기준 양도소득세를 계산하세요. 1세대1주택 비과세 자동 판단 및 장기보유특별공제 적용.
        </p>
      </div>

      <CapitalGainsCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          알아두어야 할 주요 내용
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <p><strong>1세대1주택 비과세:</strong> 2년 이상 보유+거주, 양도가액 12억 이하 시 비과세</p>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <p><strong>장기보유특별공제:</strong> 1세대1주택은 최대 80%, 일반 부동산은 최대 30%</p>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <p><strong>단기 양도:</strong> 보유 1년 미만 70%, 2년 미만 60% 세율 적용</p>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <p><strong>기본공제:</strong> 연간 250만원 공제</p>
          </div>
        </div>
      </div>
    </div>
  );
}
