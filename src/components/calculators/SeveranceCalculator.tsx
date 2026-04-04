"use client";

import { useState } from "react";
import { calculateSeverance, SeveranceResult } from "@/lib/calculators/severance";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

export default function SeveranceCalculator() {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(today);
  const [monthlyWage, setMonthlyWage] = useState("");
  const [annualBonus, setAnnualBonus] = useState("");
  const [annualLeave, setAnnualLeave] = useState("");
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const [error, setError] = useState("");

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function handleCalculate() {
    setError("");
    if (!startDate || !endDate) {
      setError("입사일과 퇴사일을 입력해주세요.");
      return;
    }
    if (startDate >= endDate) {
      setError("퇴사일이 입사일보다 늦어야 합니다.");
      return;
    }
    const wage = parseInt(monthlyWage.replace(/,/g, ""), 10);
    if (!wage || wage <= 0) {
      setError("월 평균임금을 입력해주세요.");
      return;
    }
    const res = calculateSeverance({
      startDate,
      endDate,
      monthlyWage: wage,
      annualBonus: parseInt(annualBonus.replace(/,/g, ""), 10) || 0,
      annualLeaveAllowance: parseInt(annualLeave.replace(/,/g, ""), 10) || 0,
    });
    setResult(res);
    trackCalculatorUse("severance", { working_days: res.workingDays });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 정보 입력</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                입사일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                퇴사일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              월 평균임금 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(formatInput(e.target.value))}
                placeholder="예: 3,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">퇴직 전 3개월간 월 평균 기본급 + 수당</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연간 상여금 합계 (선택)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={annualBonus}
                onChange={(e) => setAnnualBonus(formatInput(e.target.value))}
                placeholder="예: 6,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연차수당 합계 (선택)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={annualLeave}
                onChange={(e) => setAnnualLeave(formatInput(e.target.value))}
                placeholder="예: 500,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            onClick={handleCalculate}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-base"
          >
            계산하기
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h2>

          {!result.isEligible ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800 font-medium">퇴직금 지급 대상이 아닙니다</p>
              <p className="text-sm text-yellow-700 mt-1">
                재직일수 {result.workingDays}일 — 퇴직금은 1년(365일) 이상 근무해야 발생합니다.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-teal-50 rounded-xl p-5 text-center mb-6">
                <p className="text-sm text-teal-600 font-medium mb-1">예상 퇴직금</p>
                <p className="text-3xl font-bold text-teal-700">{formatKRW(result.severancePay)}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "재직일수", value: `${formatNumber(result.workingDays)}일` },
                  { label: "근속연수", value: `${result.workingYears}년` },
                  { label: "1일 평균임금", value: formatKRW(result.averageDailyWage) },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="font-semibold text-gray-800 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="font-medium text-gray-700 mb-2">계산 공식</p>
                <p>1일 평균임금 × 30일 × (재직일수 ÷ 365)</p>
                <p className="mt-1 text-xs text-gray-400">
                  = {formatKRW(result.averageDailyWage)} × 30 × {result.workingYears} = {formatKRW(result.severancePay)}
                </p>
              </div>
            </>
          )}

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 본 계산기는 근로기준법 기준 법정퇴직금을 계산합니다. 실제 퇴직금은 회사 규정, 퇴직연금 방식(DB/DC)에 따라 다를 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
