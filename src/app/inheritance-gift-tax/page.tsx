import type { Metadata } from "next";
import InheritanceGiftTaxCalculator from "@/components/calculators/InheritanceGiftTaxCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://korean-calc.vercel.app";

export const metadata: Metadata = {
  title: "상속세 증여세 계산기 2026 - 세율·공제·세대생략 할증",
  description:
    "상속세·증여세 계산기. 과세표준 구간별 세율(10~50%), 증여 관계별 공제액, 세대생략 할증(30%), 신고세액공제(3%)를 반영한 예상 세액을 계산합니다.",
  keywords: [
    "상속세 계산기",
    "증여세 계산기",
    "상속세율",
    "증여세율",
    "증여 공제",
    "세대생략 할증",
    "상속세 신고",
    "2026 상속세",
    "증여세 면제 한도",
    "상속 증여 세금",
  ],
  alternates: {
    canonical: `${BASE_URL}/inheritance-gift-tax`,
    languages: { "ko-KR": `${BASE_URL}/inheritance-gift-tax` },
  },
  openGraph: {
    title: "상속세 증여세 계산기 2026",
    description: "상속세·증여세를 과세표준 구간별 세율과 각종 공제를 반영하여 계산합니다.",
    type: "website",
    url: `${BASE_URL}/inheritance-gift-tax`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "상속세 증여세 계산기 2026",
    description: "상속세·증여세 예상 세액을 간편하게 계산하세요.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/inheritance-gift-tax`,
      name: "상속세 증여세 계산기",
      url: `${BASE_URL}/inheritance-gift-tax`,
      description: "상속세·증여세 예상 세액 계산기. 과세표준 구간별 세율, 공제, 할증 반영.",
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
          name: "증여세 면제 한도는 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "배우자 증여는 6억원, 직계존비속(성인)은 5,000만원, 미성년 자녀는 2,000만원, 기타 친족은 1,000만원까지 공제됩니다. 10년간 합산 기준입니다.",
          },
        },
        {
          "@type": "Question",
          name: "상속세 세율은 어떻게 되나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "상속세는 과세표준에 따라 1억 이하 10%, 5억 이하 20%, 10억 이하 30%, 30억 이하 40%, 30억 초과 50%의 세율이 적용됩니다.",
          },
        },
      ],
    },
  ],
};

export default function InheritanceGiftTaxPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          상속세·증여세 계산기
        </h1>
        <p className="text-gray-500">
          상속 재산이나 증여 재산에 대한 예상 세액을 계산합니다.
        </p>
      </div>

      <InheritanceGiftTaxCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">상속세·증여세 세율표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">과세표준</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">세율</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">누진공제</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {[
                { range: "1억원 이하", rate: "10%", deduction: "-" },
                { range: "1억 ~ 5억원", rate: "20%", deduction: "1,000만원" },
                { range: "5억 ~ 10억원", rate: "30%", deduction: "6,000만원" },
                { range: "10억 ~ 30억원", rate: "40%", deduction: "1억 6,000만원" },
                { range: "30억원 초과", rate: "50%", deduction: "4억 6,000만원" },
              ].map((row) => (
                <tr key={row.range} className="border-b border-gray-100">
                  <td className="py-2 px-3">{row.range}</td>
                  <td className="py-2 px-3 text-right font-medium">{row.rate}</td>
                  <td className="py-2 px-3 text-right">{row.deduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          {[
            {
              q: "증여세 면제 한도는 10년 합산인가요?",
              a: "네, 증여 공제는 동일인으로부터 10년간 받은 증여 재산을 합산하여 적용됩니다. 예를 들어 부모님으로부터 10년간 총 5,000만원까지 비과세입니다.",
            },
            {
              q: "상속세 일괄공제란 무엇인가요?",
              a: "상속 시 기초공제(2억원)와 인적공제의 합계액 또는 일괄공제(5억원) 중 큰 금액을 선택할 수 있습니다. 대부분의 경우 일괄공제 5억원이 유리합니다.",
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
