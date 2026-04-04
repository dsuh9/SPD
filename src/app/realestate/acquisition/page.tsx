import type { Metadata } from "next";
import AcquisitionTaxCalculator from "@/components/calculators/AcquisitionTaxCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://divine-rejoicing-production.up.railway.app";

export const metadata: Metadata = {
  title: "취득세 계산기 2026 - 부동산 취득세 자동계산",
  description:
    "2026년 부동산 취득세 계산기. 주택 취득세율, 다주택자 중과세율(8%, 12%), 농어촌특별세, 지방교육세를 포함한 정확한 취득세를 계산하세요.",
  keywords: [
    "취득세 계산기",
    "부동산 취득세",
    "주택 취득세율",
    "다주택자 취득세",
    "조정대상지역 취득세",
    "농어촌특별세",
    "지방교육세",
    "2026 취득세",
    "취득세율",
  ],
  alternates: {
    canonical: `${BASE_URL}/realestate/acquisition`,
    languages: { "ko-KR": `${BASE_URL}/realestate/acquisition` },
  },
  openGraph: {
    title: "부동산 취득세 계산기 2026 - 다주택자 중과세율 자동계산",
    description: "주택, 토지, 상업용 부동산의 취득세를 계산하세요. 다주택자 중과세율 자동 적용.",
    type: "website",
    url: `${BASE_URL}/realestate/acquisition`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "취득세 계산기 2026",
    description: "주택 취득세, 다주택자 중과세율을 자동 계산합니다.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/realestate/acquisition`,
      name: "취득세 계산기",
      url: `${BASE_URL}/realestate/acquisition`,
      description: "2026년 부동산 취득세 계산기. 다주택자 중과세율 자동 적용.",
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
          name: "2026년 1주택자 취득세율은 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "2026년 1주택자 취득세율은 6억 이하 1%, 6억~9억 1~3%(비례), 9억 초과 3%입니다. 여기에 농어촌특별세와 지방교육세가 추가됩니다.",
          },
        },
        {
          "@type": "Question",
          name: "다주택자 취득세 중과세율은 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "조정대상지역 내 2주택자는 8%, 3주택 이상 또는 비조정지역 3주택은 12%의 중과세율이 적용됩니다.",
          },
        },
      ],
    },
  ],
};

export default function AcquisitionTaxPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          취득세 계산기
        </h1>
        <p className="text-gray-500">
          2026년 기준 부동산 취득세, 농어촌특별세, 지방교육세를 계산하세요.
        </p>
      </div>

      <AcquisitionTaxCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          2026년 주택 취득세율 요약
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 font-medium text-gray-600">구분</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600">6억 이하</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600">6~9억</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600">9억 초과</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="py-2 px-3 text-gray-700">1주택 (실거주)</td>
                <td className="text-center py-2 px-3 text-blue-600 font-medium">1%</td>
                <td className="text-center py-2 px-3 text-blue-600 font-medium">1~3%</td>
                <td className="text-center py-2 px-3 text-blue-600 font-medium">3%</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 px-3 text-gray-700">2주택 (조정지역)</td>
                <td className="text-center py-2 px-3 text-orange-600 font-medium" colSpan={3}>8%</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 px-3 text-gray-700">3주택 이상</td>
                <td className="text-center py-2 px-3 text-red-600 font-medium" colSpan={3}>12%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
