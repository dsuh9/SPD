import type { Metadata } from "next";
import CapitalGainsCalculator from "@/components/calculators/CapitalGainsCalculator";

export const metadata: Metadata = {
  title: "양도소득세 계산기",
  description:
    "2025년 양도소득세 계산기. 1세대1주택 비과세 자동 판단, 장기보유특별공제 적용, 다주택자 중과세율 반영. 간편하게 양도세를 계산하세요.",
  keywords: [
    "양도소득세 계산기",
    "양도세 계산기",
    "1세대1주택 비과세",
    "장기보유특별공제",
    "부동산 양도세",
    "다주택자 양도세",
    "2025 양도소득세",
  ],
  openGraph: {
    title: "양도소득세 계산기 2025 - 비과세 자동 판단",
    description: "부동산 양도소득세를 계산하세요. 1세대1주택 비과세, 장기보유특별공제 자동 적용.",
    type: "website",
  },
};

export default function CapitalGainsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          양도소득세 계산기
        </h1>
        <p className="text-gray-500">
          2025년 기준 양도소득세를 계산하세요. 1세대1주택 비과세 자동 판단 및 장기보유특별공제 적용.
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
