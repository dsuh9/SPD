"use client";

import { useState } from "react";
import {
  calculateInheritanceTax,
  calculateGiftTax,
  GIFT_RELATIONSHIP_LABELS,
  type InheritanceResult,
  type GiftResult,
} from "@/lib/calculators/inheritance-gift-tax";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

type Mode = "inheritance" | "gift";

export default function InheritanceGiftTaxCalculator() {
  const [mode, setMode] = useState<Mode>("gift");
  const [amount, setAmount] = useState("");
  const [deduction, setDeduction] = useState("");
  const [relationship, setRelationship] = useState("lineal_descendant");
  const [isGenerationSkip, setIsGenerationSkip] = useState(false);
  const [result, setResult] = useState<InheritanceResult | GiftResult | null>(null);

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function handleCalculate() {
    const val = parseInt(amount.replace(/,/g, ""), 10);
    if (!val || val <= 0) return;

    if (mode === "inheritance") {
      const ded = parseInt(deduction.replace(/,/g, "") || "0", 10);
      setResult(calculateInheritanceTax(val, ded, isGenerationSkip));
    } else {
      setResult(calculateGiftTax(val, relationship, isGenerationSkip));
    }
    trackCalculatorUse("inheritance_gift_tax", { mode, amount: val });
  }

  function handleModeChange(m: Mode) {
    setMode(m);
    setAmount("");
    setDeduction("");
    setResult(null);
  }

  const isGiftResult = (r: InheritanceResult | GiftResult): r is GiftResult =>
    "giftAmount" in r;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 유형 선택</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleModeChange("inheritance")}
            className={`py-4 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              mode === "inheritance"
                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="text-base font-semibold mb-1">상속세</div>
            <div className="text-xs opacity-70">피상속인 재산에 대한 상속세</div>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("gift")}
            className={`py-4 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              mode === "gift"
                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="text-base font-semibold mb-1">증여세</div>
            <div className="text-xs opacity-70">타인으로부터 받은 재산에 대한 증여세</div>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {mode === "inheritance" ? "상속 재산 총액" : "증여 재산 가액"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(formatInput(e.target.value))}
                placeholder="금액을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          {mode === "inheritance" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">공제액 합계</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={deduction}
                  onChange={(e) => setDeduction(formatInput(e.target.value))}
                  placeholder="일괄공제 5억원 등"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
              </div>
            </div>
          )}

          {mode === "gift" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">증여자와의 관계</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Object.entries(GIFT_RELATIONSHIP_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isGenerationSkip}
              onChange={(e) => setIsGenerationSkip(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            세대생략 (손자녀 등에게 직접 상속/증여 시 30% 할증)
          </label>

          <button
            onClick={handleCalculate}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-base"
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
                {isGiftResult(result) ? "증여 재산 가액" : "상속 재산 총액"}
              </span>
              <span className="text-lg font-bold text-gray-800">
                {formatKRW(isGiftResult(result) ? result.giftAmount : result.taxableAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">
                {isGiftResult(result) ? "증여 공제" : "공제액"}
              </span>
              <span className="text-lg font-bold text-gray-800">
                {formatKRW(isGiftResult(result) ? result.exemption : result.deduction)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">과세표준</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.taxBase)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">산출세액</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.calculatedTax)}</span>
            </div>
            {result.generationSkipSurcharge > 0 && (
              <div className="flex justify-between items-center p-4 rounded-lg bg-orange-50">
                <span className="text-sm font-medium text-gray-700">세대생략 할증 (30%)</span>
                <span className="text-lg font-bold text-orange-700">
                  +{formatKRW(result.generationSkipSurcharge)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50">
              <span className="text-sm font-medium text-gray-700">신고세액공제 (3%)</span>
              <span className="text-lg font-bold text-blue-700">-{formatKRW(result.reportDiscount)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-emerald-50 border-2 border-emerald-200">
              <span className="text-sm font-medium text-gray-700">최종 납부세액</span>
              <span className="text-xl font-bold text-emerald-700">{formatKRW(result.finalTax)}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 실제 세액은 감정평가, 채무 차감, 세대생략 적용 여부 등에 따라 달라질 수 있습니다. 정확한 세액은 세무사와 상담하세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
