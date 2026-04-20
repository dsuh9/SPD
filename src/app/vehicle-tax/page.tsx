import type { Metadata } from "next";
import VehicleTaxCalculator from "@/components/calculators/VehicleTaxCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://korean-calc.vercel.app";

export const metadata: Metadata = {
  title: "자동차세 계산기 2026 - 배기량·전기차·연납 할인",
  description:
    "자동차세 계산기. 배기량 기반 세액 계산, 전기차 정액세, 차령 경감(최대 50%), 1월 연납 할인(약 4.58%)을 반영합니다.",
  keywords: [
    "자동차세 계산기",
    "자동차세",
    "배기량 세금",
    "전기차 세금",
    "차령 경감",
    "연납 할인",
    "자동차세 연납",
    "2026 자동차세",
    "지방교육세",
    "자동차 세금",
  ],
  alternates: {
    canonical: `${BASE_URL}/vehicle-tax`,
    languages: { "ko-KR": `${BASE_URL}/vehicle-tax` },
  },
  openGraph: {
    title: "자동차세 계산기 2026",
    description: "배기량, 차령, 연납 할인을 반영한 자동차세를 계산합니다.",
    type: "website",
    url: `${BASE_URL}/vehicle-tax`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "자동차세 계산기 2026",
    description: "내 차 자동차세와 연납 할인 금액을 확인하세요.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/vehicle-tax`,
      name: "자동차세 계산기",
      url: `${BASE_URL}/vehicle-tax`,
      description: "배기량·차령·연납 할인 반영 자동차세 계산기.",
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
          name: "자동차세 연납 신청은 어떻게 하나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "매년 1월 위택스(wetax.go.kr)에서 신청할 수 있습니다. 1월 연납 시 연간 세액의 약 4.58% 할인을 받습니다. 3월, 6월, 9월에도 신청 가능하나 할인율이 낮아집니다.",
          },
        },
        {
          "@type": "Question",
          name: "전기차 자동차세는 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "전기차는 배기량이 없어 정액 13만원(비영업용 기준)이 부과됩니다. 지방교육세 30%를 포함하면 연간 약 16.9만원입니다.",
          },
        },
      ],
    },
  ],
};

export default function VehicleTaxPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          자동차세 계산기
        </h1>
        <p className="text-gray-500">
          배기량, 차령, 연납 할인을 반영한 자동차세를 계산합니다.
        </p>
      </div>

      <VehicleTaxCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">비영업용 자동차세 기준</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">배기량</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">cc당 세액</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3">1,000cc 이하</td>
                <td className="py-2 px-3 text-right font-medium">80원/cc</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3">1,000cc ~ 1,600cc</td>
                <td className="py-2 px-3 text-right font-medium">140원/cc</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3">1,600cc 초과</td>
                <td className="py-2 px-3 text-right font-medium">200원/cc</td>
              </tr>
              <tr>
                <td className="py-2 px-3">전기차</td>
                <td className="py-2 px-3 text-right font-medium">정액 130,000원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          {[
            {
              q: "차령 경감은 언제부터 적용되나요?",
              a: "최초 등록일로부터 3년째부터 매년 5%씩 경감되며, 최대 50%까지 할인됩니다. 예를 들어 12년 이상 된 차량은 자동차세가 절반으로 줄어듭니다.",
            },
            {
              q: "자동차세 납부 시기는 언제인가요?",
              a: "매년 6월과 12월에 각각 반액씩 고지됩니다. 연납 신청을 하면 1월에 한 번에 납부하고 할인을 받을 수 있습니다.",
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
