"use client";

import { useState } from "react";
import { calculateYearEndTax, type YearEndTaxResult } from "@/lib/calculators/year-end-tax";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

export default function YearEndTaxCalculator() {
  const [totalSalary, setTotalSalary] = useState("");
  const [familyCount, setFamilyCount] = useState("1");
  const [childCount, setChildCount] = useState("0");
  const [creditCardAmount, setCreditCardAmount] = useState("");
  const [medicalExpense, setMedicalExpense] = useState("");
  const [educationExpense, setEducationExpense] = useState("");
  const [insurancePremium, setInsurancePremium] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [paidTax, setPaidTax] = useState("");
  const [result, setResult] = useState<YearEndTaxResult | null>(null);

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function parseAmount(value: string): number {
    return parseInt(value.replace(/,/g, "") || "0", 10);
  }

  function handleCalculate() {
    const salary = parseAmount(totalSalary);
    if (!salary || salary <= 0) return;

    const res = calculateYearEndTax({
      totalSalary: salary,
      familyCount: parseInt(familyCount, 10) || 1,
      childCount: parseInt(childCount, 10) || 0,
      creditCardAmount: parseAmount(creditCardAmount),
      medicalExpense: parseAmount(medicalExpense),
      educationExpense: parseAmount(educationExpense),
      insurancePremium: parseAmount(insurancePremium),
      donationAmount: parseAmount(donationAmount),
      paidTax: parseAmount(paidTax),
    });
    setResult(res);
    trackCalculatorUse("year_end_tax", { salary });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">기본 정보</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              총급여 (연봉) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={totalSalary}
                onChange={(e) => setTotalSalary(formatInput(e.target.value))}
                placeholder="연간 총급여를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">부양가족 수 (본인 포함)</label>
              <input
                type="number"
                min="1"
                value={familyCount}
                onChange={(e) => setFamilyCount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">자녀 수 (7세 이상)</label>
              <input
                type="number"
                min="0"
                value={childCount}
                onChange={(e) => setChildCount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
              />
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">공제 항목</h2>

        <div className="space-y-4">
          {[
            { label: "신용카드 등 사용액", value: creditCardAmount, setter: setCreditCardAmount },
            { label: "의료비 지출액", value: medicalExpense, setter: setMedicalExpense },
            { label: "교육비 지출액", value: educationExpense, setter: setEducationExpense },
            { label: "보험료 납부액", value: insurancePremium, setter: setInsurancePremium },
            { label: "기부금", value: donationAmount, setter: setDonationAmount },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={field.value}
                  onChange={(e) => field.setter(formatInput(e.target.value))}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-right pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기납부 세액 (원천징수 세액) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={paidTax}
                onChange={(e) => setPaidTax(formatInput(e.target.value))}
                placeholder="연간 원천징수 세액"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-base"
          >
            계산하기
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">연말정산 결과</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">총급여</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.totalSalary)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">근로소득공제</span>
              <span className="text-lg font-bold text-gray-800">-{formatKRW(result.earnedIncomeDeduction)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">인적공제</span>
              <span className="text-lg font-bold text-gray-800">-{formatKRW(result.personalDeduction)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">신용카드 소득공제</span>
              <span className="text-lg font-bold text-gray-800">-{formatKRW(result.creditCardDeduction)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-sm font-medium text-gray-700">과세표준</span>
              <span className="text-lg font-bold text-amber-700">{formatKRW(result.taxableIncome)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">산출세액</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.calculatedTax)}</span>
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-700 mt-6 mb-3">세액공제 내역</h3>
          <div className="space-y-2">
            {[
              { label: "근로소득세액공제", value: result.earnedIncomeTaxCredit },
              { label: "자녀세액공제", value: result.childTaxCredit },
              { label: "보험료 세액공제", value: result.insuranceCredit },
              { label: "의료비 세액공제", value: result.medicalCredit },
              { label: "교육비 세액공제", value: result.educationCredit },
              { label: "기부금 세액공제", value: result.donationCredit },
            ]
              .filter((item) => item.value > 0)
              .map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-blue-700">-{formatKRW(item.value)}</span>
                </div>
              ))}
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-100">
              <span className="text-sm font-medium text-gray-700">세액공제 합계</span>
              <span className="text-base font-bold text-blue-700">-{formatKRW(result.totalTaxCredit)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">결정세액</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.determinedTax)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">기납부 세액</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.paidTax)}</span>
            </div>
            <div
              className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                result.refundOrPayment >= 0
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <span className="text-sm font-medium text-gray-700">
                {result.refundOrPayment >= 0 ? "예상 환급액" : "추가 납부액"}
              </span>
              <span
                className={`text-xl font-bold ${
                  result.refundOrPayment >= 0 ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {result.refundOrPayment >= 0 ? "+" : ""}
                {formatKRW(Math.abs(result.refundOrPayment))}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 주요 공제 항목만 반영한 간이 계산입니다. 주택자금공제, 연금저축공제 등은 포함되지 않았습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
