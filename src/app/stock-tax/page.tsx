import type { Metadata } from "next";
import StockTaxCalculator from "@/components/calculators/StockTaxCalculator";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://korean-calc.vercel.app";

export const metadata: Metadata = {
  title: "주식 수익 세금 계산기 2026 - 국내·해외·ETF 수수료·세금",
  description:
    "주식 투자 수익 세금 계산기. 국내 주식, 미국 주식, 국내 ETF, 해외 ETF별 양도소득세, 증권거래세, 배당소득세, 매매 수수료를 반영한 실수익을 계산합니다.",
  keywords: [
    "주식 세금 계산기",
    "주식 수익률 계산기",
    "미국 주식 세금",
    "해외 주식 양도소득세",
    "증권거래세",
    "배당소득세",
    "ETF 세금",
    "주식 수수료",
    "주식 투자 수익",
    "2026 주식 세금",
  ],
  alternates: {
    canonical: `${BASE_URL}/stock-tax`,
    languages: { "ko-KR": `${BASE_URL}/stock-tax` },
  },
  openGraph: {
    title: "주식 수익 세금 계산기 2026",
    description: "국내·해외 주식, ETF별 세금과 수수료를 반영한 실수익을 계산합니다.",
    type: "website",
    url: `${BASE_URL}/stock-tax`,
    siteName: "한국 계산기 모음",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "주식 수익 세금 계산기 2026",
    description: "주식 투자 후 세금·수수료를 제외한 실수익을 확인하세요.",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/stock-tax`,
      name: "주식 수익 세금 계산기",
      url: `${BASE_URL}/stock-tax`,
      description: "국내·해외 주식, ETF별 세금·수수료 반영 실수익 계산기.",
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
          name: "국내 주식 매매 차익에 세금이 있나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "일반 개인 투자자의 국내 상장 주식 매매 차익은 비과세입니다. 다만 대주주(지분 1% 이상 또는 종목별 10억원 이상 보유)에 해당하면 양도소득세 20~25%가 부과됩니다. 증권거래세 0.18%는 모든 매도 시 부과됩니다.",
          },
        },
        {
          "@type": "Question",
          name: "미국 주식 양도소득세는 얼마인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "미국 주식(해외 주식) 양도 차익에 대해 연간 250만원 기본공제 후 22%(양도소득세 20% + 지방소득세 2%)가 부과됩니다. 매년 5월에 확정신고해야 합니다.",
          },
        },
        {
          "@type": "Question",
          name: "국내 ETF와 해외 ETF의 세금 차이는?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "국내 상장 주식형 ETF의 매매 차익은 비과세이고 증권거래세도 면제됩니다. 반면 해외 상장 ETF는 해외 주식과 동일하게 양도소득세 22%(250만원 기본공제)가 적용됩니다.",
          },
        },
      ],
    },
  ],
};

export default function StockTaxPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          주식 수익 세금 계산기
        </h1>
        <p className="text-gray-500">
          국내·해외 주식, ETF별 세금과 수수료를 반영한 실수익을 계산합니다.
        </p>
      </div>

      <StockTaxCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">종류별 세금 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">구분</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">양도소득세</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">증권거래세</th>
                <th className="text-center py-2 px-3 font-medium text-gray-700">배당소득세</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3 font-medium">국내 주식</td>
                <td className="py-2 px-3 text-center">비과세*</td>
                <td className="py-2 px-3 text-center">0.18%</td>
                <td className="py-2 px-3 text-center">15.4%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3 font-medium">미국 주식</td>
                <td className="py-2 px-3 text-center">22%</td>
                <td className="py-2 px-3 text-center">-</td>
                <td className="py-2 px-3 text-center">15%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3 font-medium">국내 ETF (주식형)</td>
                <td className="py-2 px-3 text-center">비과세</td>
                <td className="py-2 px-3 text-center">면제</td>
                <td className="py-2 px-3 text-center">15.4%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">해외 ETF</td>
                <td className="py-2 px-3 text-center">22%</td>
                <td className="py-2 px-3 text-center">-</td>
                <td className="py-2 px-3 text-center">15%</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2">* 대주주는 20~25% 양도소득세 부과. 해외 주식/ETF 양도세는 연간 250만원 기본공제 후 적용.</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          {[
            {
              q: "해외 주식 양도소득세 신고는 어떻게 하나요?",
              a: "매년 5월 종합소득세 신고 기간에 양도소득세를 확정 신고합니다. 연간 해외 주식 매매 차익에서 250만원을 공제한 금액에 22%를 적용합니다. 증권사 앱에서 양도소득 내역을 다운로드할 수 있습니다.",
            },
            {
              q: "손실이 난 경우 세금을 돌려받을 수 있나요?",
              a: "국내 주식은 매매 차익이 비과세이므로 손실에 대한 환급이 없습니다. 해외 주식은 같은 연도 내 다른 해외 주식 매매 이익과 손실을 합산(손익통산)할 수 있습니다. 단, 이월공제는 불가합니다.",
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
