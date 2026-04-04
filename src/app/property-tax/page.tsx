import type { Metadata } from "next";
import PropertyTaxCalculator from "@/components/calculators/PropertyTaxCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://divine-rejoicing-production.up.railway.app";

export const metadata: Metadata = {
  title: "종합부동산세 계산기 2026 - 종부세 자동계산",
  description:
    "2026년 종합부동산세(종부세) 계산기. 주택, 토지의 종부세를 계산하세요. 고령자 공제(최대 40%), 장기보유 공제(최대 50%), 농어촌특별세 포함.",
  keywords: [
    "종합부동산세 계산기",
    "종부세 계산기",
    "부동산 보유세",
    "종부세 계산",
    "고령자 공제",
    "장기보유 공제",
    "2026 종합부동산세",
    "공시가격",
    "종부세 납부",
  ],
  alternates: {
    canonical: `${BASE_URL}/property-tax`,
    languages: { "ko-KR": `${BASE_URL}/property-tax` },
  },
  openGraph: {
    title: "종합부동산세 계산기 2026 - 고령자·장기보유 공제 자동적용",
    description: "보유 부동산의 종합부동산세를 계산하세요. 고령자·장기보유 공제 자동 적용.",
    type: "website",
    url: `${BASE_URL}/property-tax`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "종합부동산세 계산기 2026",
    description: "종부세를 계산하세요. 고령자 공제, 장기보유 공제 자동 적용.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/property-tax`,
      name: "종합부동산세 계산기",
      url: `${BASE_URL}/property-tax`,
      description: "2026년 종합부동산세 계산기. 고령자·장기보유 공제 자동 적용.",
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
          name: "종합부동산세 부과 기준은 무엇인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "종합부동산세는 매년 6월 1일 기준으로 주택 공시가격 합산액이 9억 원(1세대1주택 단독명의는 12억 원)을 초과하는 경우 부과됩니다. 고지는 11~12월에 이루어집니다.",
          },
        },
        {
          "@type": "Question",
          name: "종합부동산세 고령자 공제는 얼마나 받을 수 있나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "고령자 세액공제는 60~64세 20%, 65~69세 30%, 70세 이상 40%입니다. 장기보유 공제와 합산 시 최대 80%까지 공제받을 수 있습니다.",
          },
        },
      ],
    },
  ],
};

export default function PropertyTaxPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          종합부동산세 계산기
        </h1>
        <p className="text-gray-500">
          2026년 기준 종합부동산세를 계산하세요. 고령자 공제 및 장기보유 공제 자동 반영.
        </p>
      </div>

      <PropertyTaxCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          종합부동산세 주요 내용
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">공제금액</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[
                { label: "1세대 1주택 (단독명의)", value: "12억원" },
                { label: "1세대 1주택 (공동명의)", value: "9억원" },
                { label: "일반 주택", value: "9억원" },
                { label: "종합합산 토지", value: "5억원" },
                { label: "별도합산 토지", value: "80억원" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between bg-gray-50 rounded p-2">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-blue-600">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">개인 공제</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[
                { label: "만 60~64세", value: "20%" },
                { label: "만 65~69세", value: "30%" },
                { label: "만 70세 이상", value: "40%" },
                { label: "보유 5~9년", value: "20%" },
                { label: "보유 10~14년", value: "40%" },
                { label: "보유 15년 이상", value: "50%" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between bg-gray-50 rounded p-2">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-green-600">{item.value} 공제</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
