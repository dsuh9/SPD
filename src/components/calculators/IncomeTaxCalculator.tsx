"use client";

import { useState } from "react";
import { calculateIncomeTax, IncomeTaxResult } from "@/lib/calculators/income-tax";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

export default function IncomeTaxCalculator() {
  const [earnedIncome, setEarnedIncome] = useState("");
  const [businessIncome, setBusinessIncome] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  const [dependents, setDependents] = useState("1");
  const [nationalPensionPaid, setNationalPensionPaid] = useState("");
  const [insurancePremium, setInsurancePremium] = useState("");
  const [medicalExpenses, setMedicalExpenses] = useState("");
  const [result, setResult] = useState<IncomeTaxResult | null>(null);

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function parseVal(v: string) {
    return parseInt(v.replace(/,/g, ""), 10) || 0;
  }

  function handleCalculate() {
    const res = calculateIncomeTax({
      earnedIncome: parseVal(earnedIncome),
      businessIncome: parseVal(businessIncome),
      interestIncome: 0,
      dividendIncome: 0,
      rentalIncome: 0,
      otherIncome: parseVal(otherIncome),
      dependents: parseInt(dependents, 10) || 1,
      nationalPensionPaid: parseVal(nationalPensionPaid),
      insurancePremium: parseVal(insurancePremium),
      medicalExpenses: parseVal(medicalExpenses),
      educationExpenses: 0,
      donationAmount: 0,
      personalDeductions: 0,
    });
    setResult(res);
    trackCalculatorUse("income_tax");
  }

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    hint,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    hint?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(formatInput(e.target.value))}
          placeholder={placeholder || "0"}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-10"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">소득 정보 입력</h2>

        <div className="space-y-4">
          <InputField
            label="근로소득 (연간)"
            value={earnedIncome}
            onChange={setEarnedIncome}
            placeholder="예: 50,000,000"
            hint="회사에서 받는 세전 연봉"
          />
          <InputField
            label="사업소득 (연간)"
            value={businessIncome}
            onChange={setBusinessIncome}
            placeholder="프리랜서, 개인사업 등"
          />
          <InputField
            label="기타소득 (연간)"
            value={otherIncome}
            onChange={setOtherIncome}
            placeholder="강연료, 원고료 등"
          />

          <hr className="border-gray-200" />
          <h3 className="text-sm font-semibold text-gray-700">공제 항목</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">부양가족 수 (본인 포함)</label>
            <select
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}명{n === 1 ? " (본인만)" : ""}</option>
              ))}
            </select>
          </div>

          <InputField
            label="납부한 국민연금 (연간)"
            value={nationalPensionPaid}
            onChange={setNationalPensionPaid}
            hint="근로자의 경우 급여에서 이미 공제됨"
          />
          <InputField
            label="보험료 납부액 (연간)"
            value={insurancePremium}
            onChange={setInsurancePremium}
          />
          <InputField
            label="의료비 지출액 (연간)"
            value={medicalExpenses}
            onChange={setMedicalExpenses}
          />

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-base"
          >
            계산하기
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-sm text-red-600 font-medium mb-1">종합소득세</p>
              <p className="text-xl font-bold text-red-700">{formatKRW(result.finalTax)}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-sm text-orange-600 font-medium mb-1">총 세금 (지방세 포함)</p>
              <p className="text-xl font-bold text-orange-700">{formatKRW(result.totalTax)}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-center">
            <span className="text-sm text-gray-600">실효세율 </span>
            <span className="text-lg font-bold text-gray-800">{result.effectiveTaxRate}%</span>
            <span className="text-sm text-gray-500 ml-2">(최고 세율 {result.taxRate}%)</span>
          </div>

          <div className="space-y-2">
            {[
              { label: "총 수입금액", amount: result.totalIncome },
              { label: "필요경비/소득공제", amount: -result.totalExpenseDeduction },
              { label: "소득금액", amount: result.totalDeductedIncome, highlight: false },
              { label: "인적공제", amount: -result.totalPersonalDeduction },
              { label: "특별공제 (표준공제 포함)", amount: -result.specialDeduction },
              { label: "국민연금 공제", amount: -result.nationalPensionDeduction },
              { label: "과세표준", amount: result.taxBase, highlight: true },
              { label: "산출세액", amount: result.calculatedTax },
              { label: "세액공제", amount: -result.taxCredit },
              { label: "결정세액 (종합소득세)", amount: result.finalTax },
              { label: "지방소득세 (10%)", amount: result.localIncomeTax },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${
                  item.highlight ? "bg-gray-50 rounded px-2" : ""
                }`}
              >
                <span className={`text-sm ${item.highlight ? "font-semibold" : "text-gray-600"}`}>{item.label}</span>
                <span className={`text-sm font-medium ${item.amount < 0 ? "text-green-600" : "text-gray-800"}`}>
                  {item.amount < 0 ? `- ${formatKRW(Math.abs(item.amount))}` : formatKRW(item.amount)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 사업소득의 필요경비는 실제와 다를 수 있습니다. 본 계산은 참고용으로, 정확한 세금은 국세청 홈택스 또는 세무사를 통해 신고하세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
