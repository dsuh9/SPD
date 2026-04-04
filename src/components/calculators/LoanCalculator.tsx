"use client";

import { useState } from "react";
import { calculateLoan, LoanResult, RepaymentType } from "@/lib/calculators/loan";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

const REPAYMENT_LABELS: Record<RepaymentType, string> = {
  equal_payment: "원리금균등상환",
  equal_principal: "원금균등상환",
  bullet: "만기일시상환",
};

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [termMonths, setTermMonths] = useState("120");
  const [repaymentType, setRepaymentType] = useState<RepaymentType>("equal_payment");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [error, setError] = useState("");

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function handleCalculate() {
    setError("");
    const p = parseInt(principal.replace(/,/g, ""), 10);
    const r = parseFloat(annualRate);
    const t = parseInt(termMonths, 10);
    if (!p || p <= 0) { setError("대출원금을 입력해주세요."); return; }
    if (!r || r <= 0 || r > 100) { setError("연이율을 올바르게 입력해주세요 (예: 3.5)."); return; }
    if (!t || t <= 0 || t > 600) { setError("대출기간을 올바르게 입력해주세요."); return; }

    const res = calculateLoan({ principal: p, annualRate: r, termMonths: t, repaymentType });
    setResult(res);
    setShowSchedule(false);
    trackCalculatorUse("loan", { principal: p, term_months: t, repayment_type: repaymentType });
  }

  const schedulePreview = result?.schedule.slice(0, 12) ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 정보 입력</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              대출원금 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={principal}
                onChange={(e) => setPrincipal(formatInput(e.target.value))}
                placeholder="예: 300,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연이율 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="100"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  placeholder="예: 3.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대출기간 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">개월</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상환 방식</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(REPAYMENT_LABELS) as RepaymentType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRepaymentType(type)}
                  className={`py-2.5 px-2 rounded-lg text-sm font-medium border transition-colors ${
                    repaymentType === type
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-indigo-300"
                  }`}
                >
                  {REPAYMENT_LABELS[type]}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {repaymentType === "equal_payment" && "매월 동일한 금액(원금+이자)을 납입하는 방식"}
              {repaymentType === "equal_principal" && "매월 동일한 원금을 상환하며 이자는 줄어드는 방식"}
              {repaymentType === "bullet" && "만기까지 이자만 납입하고 만기에 원금 일시상환"}
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            onClick={handleCalculate}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-base"
          >
            계산하기
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h2>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <p className="text-xs text-indigo-600 font-medium mb-1">
                {repaymentType === "bullet" ? "월 이자" : repaymentType === "equal_principal" ? "첫달 납입액" : "월 납입액"}
              </p>
              <p className="text-xl font-bold text-indigo-700">{formatKRW(result.monthlyPayment)}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-xs text-orange-600 font-medium mb-1">총 이자</p>
              <p className="text-xl font-bold text-orange-700">{formatKRW(result.totalInterest)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 font-medium mb-1">총 상환금액</p>
              <p className="text-xl font-bold text-green-700">{formatKRW(result.totalPayment)}</p>
            </div>
          </div>

          {/* 상환 스케줄 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">상환 스케줄</h3>
              {result.schedule.length > 12 && (
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  {showSchedule ? "접기" : `전체 ${result.schedule.length}개월 보기`}
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500">
                    <th className="text-left py-2 px-3 rounded-tl-lg">회차</th>
                    <th className="text-right py-2 px-3">납입액</th>
                    <th className="text-right py-2 px-3">원금</th>
                    <th className="text-right py-2 px-3">이자</th>
                    <th className="text-right py-2 px-3 rounded-tr-lg">잔금</th>
                  </tr>
                </thead>
                <tbody>
                  {(showSchedule ? result.schedule : schedulePreview).map((row) => (
                    <tr key={row.month} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 px-3 text-gray-600">{row.month}회</td>
                      <td className="py-2 px-3 text-right font-medium">{formatKRW(row.payment)}</td>
                      <td className="py-2 px-3 text-right text-blue-600">{formatKRW(row.principal)}</td>
                      <td className="py-2 px-3 text-right text-orange-500">{formatKRW(row.interest)}</td>
                      <td className="py-2 px-3 text-right text-gray-500">{formatKRW(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 실제 대출이자는 금융기관의 우대금리, 수수료, 중도상환수수료 등에 따라 달라질 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
