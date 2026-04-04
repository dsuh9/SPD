"use client";

import { useState } from "react";
import { calculateVatFromSupply, calculateVatFromTotal, VatResult } from "@/lib/calculators/vat";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

type InputMode = "supply" | "total";

export default function VatCalculator() {
  const [inputMode, setInputMode] = useState<InputMode>("supply");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<VatResult | null>(null);

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function handleCalculate() {
    const val = parseInt(amount.replace(/,/g, ""), 10);
    if (!val || val <= 0) return;
    const res = inputMode === "supply"
      ? calculateVatFromSupply(val)
      : calculateVatFromTotal(val);
    setResult(res);
    trackCalculatorUse("vat", { input_mode: inputMode, amount: val });
  }

  function handleModeChange(mode: InputMode) {
    setInputMode(mode);
    setAmount("");
    setResult(null);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 방향 선택</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleModeChange("supply")}
            className={`py-4 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              inputMode === "supply"
                ? "bg-violet-50 border-violet-500 text-violet-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="text-base font-semibold mb-1">공급가액 → 부가세</div>
            <div className="text-xs opacity-70">부가세 제외 금액으로 계산</div>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("total")}
            className={`py-4 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              inputMode === "total"
                ? "bg-violet-50 border-violet-500 text-violet-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="text-base font-semibold mb-1">부가세포함가 → 공급가액</div>
            <div className="text-xs opacity-70">부가세 포함 금액으로 역산</div>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {inputMode === "supply" ? "공급가액 (부가세 제외)" : "공급대가 (부가세 포함)"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(formatInput(e.target.value))}
                placeholder="금액을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors text-base"
          >
            계산하기
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h2>

          <div className="space-y-3">
            {[
              {
                label: "공급가액 (부가세 제외)",
                value: formatKRW(result.supplyAmount),
                highlight: inputMode === "total",
                color: "blue",
              },
              {
                label: "부가세액 (10%)",
                value: formatKRW(result.vatAmount),
                highlight: false,
                color: "orange",
              },
              {
                label: "공급대가 (부가세 포함)",
                value: formatKRW(result.totalAmount),
                highlight: inputMode === "supply",
                color: "green",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex justify-between items-center p-4 rounded-lg ${
                  item.highlight ? "bg-violet-50 border-2 border-violet-200" : "bg-gray-50"
                }`}
              >
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className={`text-lg font-bold ${item.highlight ? "text-violet-700" : "text-gray-800"}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">부가세 신고 예상액</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">매출세액 (납부 세액)</span>
              <span className="text-xl font-bold text-violet-700">{formatKRW(result.declarationVat)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              * 실제 납부세액 = 매출세액 - 매입세액(공제). 매입세액 공제는 별도 계산이 필요합니다.
            </p>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 일반과세자(연 매출 8,000만원 이상) 기준 10% 세율 적용. 간이과세자는 업종별로 낮은 세율이 적용됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
