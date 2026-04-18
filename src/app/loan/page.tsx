import type { Metadata } from "next";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://korean-calc.vercel.app";

export const metadata: Metadata = {
  title: "대출이자 계산기 2026 - 원리금균등·원금균등·만기일시 상환",
  description:
    "대출원금, 연이율, 기간 입력으로 월 상환액과 총 이자를 즉시 계산. 원리금균등·원금균등·만기일시 상환 방식별 비교 및 월별 상환 스케줄 제공.",
  keywords: [
    "대출이자 계산기",
    "대출 계산기",
    "원리금균등상환",
    "원금균등상환",
    "만기일시상환",
    "주택담보대출 이자",
    "대출 월상환액",
    "대출 총이자",
    "2026 대출",
    "모기지 계산기",
  ],
  alternates: {
    canonical: `${BASE_URL}/loan`,
    languages: { "ko-KR": `${BASE_URL}/loan` },
  },
  openGraph: {
    title: "대출이자 계산기 2026 - 원리금균등·원금균등·만기일시",
    description: "대출원금·금리·기간 입력으로 월 납입액과 총 이자를 즉시 확인하세요.",
    type: "website",
    url: `${BASE_URL}/loan`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "대출이자 계산기 2026",
    description: "원리금균등·원금균등·만기일시 상환 방식별 이자와 월 상환액을 계산합니다.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/loan`,
      name: "대출이자 계산기",
      url: `${BASE_URL}/loan`,
      description: "원리금균등, 원금균등, 만기일시 상환 방식별 대출이자 및 월 상환액 계산기.",
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
          name: "원리금균등상환과 원금균등상환의 차이는?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "원리금균등상환은 매월 동일한 금액을 납입하며 초기에 이자 비중이 높습니다. 원금균등상환은 매월 같은 원금을 상환하므로 초기 납입액이 높지만 이자 총액이 적습니다.",
          },
        },
        {
          "@type": "Question",
          name: "3억 대출 연 4% 30년 원리금균등 월 납입액은?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "대출원금 3억원, 연이율 4%, 30년(360개월) 원리금균등상환 시 월 납입액은 약 143만원 수준이며 총 이자는 약 2억 1천만원입니다.",
          },
        },
        {
          "@type": "Question",
          name: "만기일시상환이 유리한 경우는?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "만기일시상환은 매월 이자만 납부하므로 월 부담이 가장 적습니다. 단, 총 이자가 가장 많이 발생합니다. 단기 대출이나 투자 목적으로 활용 시 유리할 수 있습니다.",
          },
        },
      ],
    },
  ],
};

export default function LoanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          대출이자 계산기
        </h1>
        <p className="text-gray-500">
          원리금균등·원금균등·만기일시 상환 방식별 이자와 월 납입액을 계산합니다.
        </p>
      </div>

      <LoanCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">상환 방식 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-4 text-gray-500">구분</th>
                <th className="text-center py-2 px-4 text-gray-500">원리금균등</th>
                <th className="text-center py-2 px-4 text-gray-500">원금균등</th>
                <th className="text-center py-2 px-4 text-gray-500">만기일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { label: "월 납입액", a: "고정", b: "초기↑ 후 감소", c: "이자만(고정)" },
                { label: "총 이자", a: "중간", b: "가장 적음", c: "가장 많음" },
                { label: "초기 부담", a: "보통", b: "높음", c: "낮음" },
                { label: "적합한 경우", a: "일반 가계대출", b: "여유자금 있을 때", c: "단기·투자목적" },
              ].map((row) => (
                <tr key={row.label}>
                  <td className="py-3 px-4 font-medium text-gray-700">{row.label}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.a}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.b}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.c}</td>
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
              q: "원리금균등상환과 원금균등상환 중 어느 쪽이 이자가 더 적나요?",
              a: "원금균등상환의 총 이자가 원리금균등상환보다 적습니다. 원금균등은 초기에 원금을 많이 상환하므로 잔여원금이 빠르게 줄어들어 이자가 적게 발생합니다.",
            },
            {
              q: "변동금리 대출도 이 계산기로 계산할 수 있나요?",
              a: "본 계산기는 고정금리 기준으로 계산합니다. 변동금리 대출은 금리 변동 시점마다 납입액이 달라지므로, 현재 금리 기준의 참고값으로 활용하세요.",
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
