import type { Metadata } from "next";
import IncomeTaxCalculator from "@/components/calculators/IncomeTaxCalculator";

export const metadata: Metadata = {
  title: "종합소득세 계산기",
  description:
    "2025년 종합소득세 계산기. 근로소득, 사업소득, 프리랜서 소득에 대한 종합소득세를 계산하세요. 인적공제, 특별공제 자동 적용.",
  keywords: [
    "종합소득세 계산기",
    "종소세 계산기",
    "프리랜서 세금 계산기",
    "사업소득세",
    "근로소득세",
    "소득세 계산",
    "5월 종합소득세",
    "2025 종합소득세",
  ],
  openGraph: {
    title: "종합소득세 계산기 2025 - 프리랜서/사업자",
    description: "근로소득, 사업소득에 대한 종합소득세를 계산하세요. 2025년 최신 세법 적용.",
    type: "website",
  },
};

export default function IncomeTaxPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          종합소득세 계산기
        </h1>
        <p className="text-gray-500">
          2025년 기준 종합소득세를 계산하세요. 프리랜서, 개인사업자, 직장인 모두 사용 가능.
        </p>
      </div>

      <IncomeTaxCalculator />

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          2025년 종합소득세율 구간
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 font-medium text-gray-600">과세표준</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600">세율</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600">누진공제</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: "1,400만원 이하", rate: "6%", deduct: "-" },
                { range: "1,400만~5,000만원", rate: "15%", deduct: "126만원" },
                { range: "5,000만~8,800만원", rate: "24%", deduct: "576만원" },
                { range: "8,800만~1.5억원", rate: "35%", deduct: "1,544만원" },
                { range: "1.5억~3억원", rate: "38%", deduct: "1,994만원" },
                { range: "3억~5억원", rate: "40%", deduct: "2,594만원" },
                { range: "5억~10억원", rate: "42%", deduct: "3,594만원" },
                { range: "10억원 초과", rate: "45%", deduct: "6,594만원" },
              ].map((row) => (
                <tr key={row.range} className="border-t border-gray-100">
                  <td className="py-2 px-3 text-gray-700">{row.range}</td>
                  <td className="text-center py-2 px-3 text-blue-600 font-medium">{row.rate}</td>
                  <td className="text-center py-2 px-3 text-gray-500">{row.deduct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
