import type { Metadata } from "next";
import VatCalculator from "@/components/calculators/VatCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://korean-calc.vercel.app";

export const metadata: Metadata = {
  title: "부가세 계산기 2026 - 공급가액·부가세 포함가 변환",
  description:
    "부가세(VAT) 계산기. 공급가액 입력으로 부가세 10% 자동 계산, 부가세 포함 금액에서 공급가액 역산. 부가세 신고 예상 매출세액도 확인하세요.",
  keywords: [
    "부가세 계산기",
    "VAT 계산기",
    "부가가치세 계산",
    "공급가액 계산",
    "부가세 포함가",
    "부가세 역산",
    "매출세액",
    "부가세 신고",
    "2026 부가세",
    "사업자 부가세",
  ],
  alternates: {
    canonical: `${BASE_URL}/vat`,
    languages: { "ko-KR": `${BASE_URL}/vat` },
  },
  openGraph: {
    title: "부가세 계산기 2026 - 공급가액·부가세 포함가 변환",
    description: "공급가액에서 부가세를 계산하거나 부가세 포함 금액에서 공급가액을 역산합니다.",
    type: "website",
    url: `${BASE_URL}/vat`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "부가세 계산기 2026",
    description: "공급가액과 부가세 포함가를 상호 변환하고 신고 예상 매출세액을 확인하세요.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/vat`,
      name: "부가세 계산기",
      url: `${BASE_URL}/vat`,
      description: "공급가액과 부가세 포함가 상호 변환 및 부가세 신고 예상액 계산기.",
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
          name: "공급가액과 공급대가(부가세 포함가)의 차이는?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "공급가액은 부가세를 제외한 금액이고, 공급대가(부가세 포함가)는 공급가액에 부가세 10%를 더한 금액입니다. 세금계산서 발행 시 이 두 금액을 구분해야 합니다.",
          },
        },
        {
          "@type": "Question",
          name: "부가세 신고는 언제 하나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "일반과세자는 연 2회(1기: 1~6월분을 7월에, 2기: 7~12월분을 1월에) 부가세 신고를 합니다. 법인사업자는 분기별로 예정신고를 추가로 합니다.",
          },
        },
        {
          "@type": "Question",
          name: "1,100만원 받은 경우 부가세는 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "부가세 포함 1,100만원을 받은 경우 공급가액은 1,000만원, 부가세는 100만원입니다. 부가세 포함가 ÷ 1.1 = 공급가액으로 계산합니다.",
          },
        },
      ],
    },
  ],
};

export default function VatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          부가세(VAT) 계산기
        </h1>
        <p className="text-gray-500">
          공급가액 ↔ 부가세 포함가 변환 및 부가세 신고 예상액을 계산합니다.
        </p>
      </div>

      <VatCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">부가세 기본 개념</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            {
              title: "공급가액 → 부가세 포함가",
              formula: "공급가액 × 1.1",
              example: "1,000,000원 × 1.1 = 1,100,000원",
            },
            {
              title: "부가세 포함가 → 공급가액",
              formula: "공급대가 ÷ 1.1",
              example: "1,100,000원 ÷ 1.1 = 1,000,000원",
            },
            {
              title: "부가세액 계산",
              formula: "공급가액 × 10%",
              example: "1,000,000원 × 0.1 = 100,000원",
            },
            {
              title: "납부세액",
              formula: "매출세액 - 매입세액",
              example: "매입세액 차감 후 실제 납부",
            },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-1">{item.title}</p>
              <p className="font-mono text-violet-700 text-sm">{item.formula}</p>
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
              q: "간이과세자도 부가세를 내나요?",
              a: "네, 간이과세자도 부가세를 납부합니다. 다만 연 매출 4,800만원 미만 간이과세자는 업종별 부가가치율(15~40%)에 10%를 적용한 낮은 세율을 적용받습니다. 연 매출 4,800만원 이상 8,000만원 미만도 간이과세 적용이 가능합니다.",
            },
            {
              q: "세금계산서와 영수증의 차이는?",
              a: "세금계산서는 사업자 간 거래 시 발행하며 부가세를 별도 표기합니다. 소비자 대상 거래에서는 영수증(현금영수증, 신용카드전표)을 발행하며 부가세 포함 금액을 기재합니다.",
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
