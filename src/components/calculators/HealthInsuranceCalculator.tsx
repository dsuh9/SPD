"use client";

import { useState } from "react";
import {
  calculateEmployeeHealthInsurance,
  calculateSelfEmployedHealthInsurance,
  type HealthInsuranceResult,
} from "@/lib/calculators/health-insurance";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

type InsuranceType = "employee" | "selfEmployed";

export default function HealthInsuranceCalculator() {
  const [type, setType] = useState<InsuranceType>("employee");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState<HealthInsuranceResult | null>(null);

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function handleCalculate() {
    const val = parseInt(income.replace(/,/g, ""), 10);
    if (!val || val <= 0) return;

    const res =
      type === "employee"
        ? calculateEmployeeHealthInsurance(val)
        : calculateSelfEmployedHealthInsurance(val);
    setResult(res);
    trackCalculatorUse("health_insurance", { type, income: val });
  }

  function handleTypeChange(t: InsuranceType) {
    setType(t);
    setIncome("");
    setResult(null);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">가입자 유형</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleTypeChange("employee")}
            className={`py-4 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              type === "employee"
                ? "bg-cyan-50 border-cyan-500 text-cyan-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="text-base font-semibold mb-1">직장가입자</div>
            <div className="text-xs opacity-70">회사와 본인이 50%씩 부담</div>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("selfEmployed")}
            className={`py-4 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              type === "selfEmployed"
                ? "bg-cyan-50 border-cyan-500 text-cyan-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="text-base font-semibold mb-1">지역가입자</div>
            <div className="text-xs opacity-70">본인이 전액 부담</div>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === "employee" ? "월 보수액 (세전 급여)" : "월 소득 금액"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={income}
                onChange={(e) => setIncome(formatInput(e.target.value))}
                placeholder="월 소득을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors text-base"
          >
            계산하기
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">
                {type === "employee" ? "월 보수액" : "월 소득"}
              </span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.monthlySalary)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">
                건강보험료 {type === "employee" && "(본인 부담분)"}
              </span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.healthInsurance)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">장기요양보험료 (12.95%)</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.longTermCare)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-cyan-50 border-2 border-cyan-200">
              <span className="text-sm font-medium text-gray-700">월 합계</span>
              <span className="text-xl font-bold text-cyan-700">{formatKRW(result.totalMonthly)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">연간 합계</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.totalYearly)}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 2025년 건강보험료율 7.09% 기준. 직장가입자는 사업주와 50%씩 부담하며, 위 금액은 본인 부담분입니다. 지역가입자는 소득·재산·자동차 점수에 따라 실제 보험료가 달라질 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
