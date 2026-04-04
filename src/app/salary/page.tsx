import type { Metadata } from "next";
import SalaryCalculator from "@/components/calculators/SalaryCalculator";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기",
  description:
    "2025년 기준 연봉 실수령액 계산기. 국민연금 4.5%, 건강보험 3.545%, 고용보험 0.9%, 소득세를 공제한 월 실수령액을 계산하세요.",
  keywords: [
    "연봉 실수령액 계산기",
    "월급 실수령액",
    "4대보험 계산",
    "국민연금 계산",
    "건강보험 계산",
    "고용보험 계산",
    "소득세 계산",
    "2025 연봉 계산기",
  ],
  openGraph: {
    title: "연봉 실수령액 계산기 2025",
    description: "세전 연봉 입력으로 4대보험, 소득세 공제 후 월 실수령액을 바로 확인하세요.",
    type: "website",
  },
};

export default function SalaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          연봉 실수령액 계산기
        </h1>
        <p className="text-gray-500">
          2025년 기준 4대보험과 소득세를 계산해 월 실수령액을 확인하세요.
        </p>
      </div>

      <SalaryCalculator />

      {/* SEO 설명 콘텐츠 */}
      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          2025년 4대보험 요율
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { name: "국민연금", rate: "4.5%", base: "기준소득월액" },
            { name: "건강보험", rate: "3.545%", base: "보수월액" },
            { name: "장기요양", rate: "0.9182%", base: "건강보험료 기준" },
            { name: "고용보험", rate: "0.9%", base: "월 보수액" },
          ].map((item) => (
            <div key={item.name} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="font-medium text-gray-700">{item.name}</p>
              <p className="text-blue-600 font-bold text-lg">{item.rate}</p>
              <p className="text-xs text-gray-400">{item.base}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
