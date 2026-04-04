"use client";

import { useState } from "react";
import { calculateSalary, SalaryResult } from "@/lib/calculators/salary";
import { formatKRW, formatNumber } from "@/lib/utils";

export default function SalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState("");
  const [dependents, setDependents] = useState("1");
  const [nonTaxable, setNonTaxable] = useState("200000");
  const [result, setResult] = useState<SalaryResult | null>(null);

  function handleCalculate() {
    const salary = parseInt(annualSalary.replace(/,/g, ""), 10);
    if (!salary || salary <= 0) return;
    const res = calculateSalary({
      annualSalary: salary,
      dependents: parseInt(dependents, 10) || 1,
      nonTaxableIncome: parseInt(nonTaxable.replace(/,/g, ""), 10) || 0,
    });
    setResult(res);
  }

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 입력 폼 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 정보 입력</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연봉 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(formatInput(e.target.value))}
                placeholder="예: 50,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">세전 연봉을 입력하세요</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              부양가족 수 (본인 포함)
            </label>
            <select
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n}명{n === 1 ? " (본인만)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비과세 소득 (월)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={nonTaxable}
                onChange={(e) => setNonTaxable(formatInput(e.target.value))}
                placeholder="200,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">식대, 차량유지비 등 비과세 소득 (기본값: 20만원)</p>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-base"
          >
            계산하기
          </button>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h2>

          {/* 핵심 결과 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-600 font-medium mb-1">월 실수령액</p>
              <p className="text-2xl font-bold text-blue-700">{formatKRW(result.monthlyNet)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600 font-medium mb-1">연 실수령액</p>
              <p className="text-2xl font-bold text-green-700">{formatKRW(result.annualNet)}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-center">
            <span className="text-sm text-gray-600">실효세율 </span>
            <span className="text-lg font-bold text-gray-800">{result.effectiveTaxRate}%</span>
            <span className="text-sm text-gray-500 ml-2">
              (월 공제 {formatKRW(result.totalDeduction)})
            </span>
          </div>

          {/* 공제 내역 */}
          <h3 className="font-medium text-gray-700 mb-3">월 공제 내역</h3>
          <div className="space-y-2">
            {[
              { label: "국민연금 (4.5%)", amount: result.nationalPension },
              { label: "건강보험 (3.545%)", amount: result.healthInsurance },
              { label: "장기요양보험 (0.9182%)", amount: result.longTermCare },
              { label: "고용보험 (0.9%)", amount: result.employmentInsurance },
              { label: "소득세", amount: result.incomeTax },
              { label: "지방소득세", amount: result.localIncomeTax },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-gray-800">{formatKRW(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 bg-red-50 rounded-lg px-3 mt-2">
              <span className="text-sm font-semibold text-red-700">총 공제액</span>
              <span className="text-sm font-bold text-red-700">{formatKRW(result.totalDeduction)}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 실제 세금은 개인 상황(추가 공제, 세액공제 등)에 따라 다를 수 있습니다. 정확한 세금은 국세청 홈택스를 통해 확인하세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
