"use client";

import { useState } from "react";
import { calculateAcquisitionTax, AcquisitionTaxResult } from "@/lib/calculators/acquisition-tax";
import { formatKRW, formatNumber } from "@/lib/utils";

export default function AcquisitionTaxCalculator() {
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState<"house" | "land" | "commercial">("house");
  const [purpose, setPurpose] = useState<"residence" | "investment">("residence");
  const [ownedHouses, setOwnedHouses] = useState("0");
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [result, setResult] = useState<AcquisitionTaxResult | null>(null);

  function handleCalculate() {
    const acquisitionPrice = parseInt(price.replace(/,/g, ""), 10);
    if (!acquisitionPrice || acquisitionPrice <= 0) return;
    const res = calculateAcquisitionTax({
      acquisitionPrice,
      propertyType,
      purpose,
      ownedHouses: parseInt(ownedHouses, 10),
      isAdjustedArea: isAdjusted,
    });
    setResult(res);
  }

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 정보 입력</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              취득가액 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(formatInput(e.target.value))}
                placeholder="예: 500,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">부동산 유형</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "house", label: "주택" },
                { value: "land", label: "토지" },
                { value: "commercial", label: "상업용" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setPropertyType(item.value as "house" | "land" | "commercial")}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    propertyType === item.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {propertyType === "house" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">취득 목적</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "residence", label: "실거주" },
                    { value: "investment", label: "투자" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setPurpose(item.value as "residence" | "investment")}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        purpose === item.value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  현재 보유 주택 수 (취득 전)
                </label>
                <select
                  value={ownedHouses}
                  onChange={(e) => setOwnedHouses(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}채{n === 0 ? " (무주택)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="adjusted"
                  checked={isAdjusted}
                  onChange={(e) => setIsAdjusted(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="adjusted" className="text-sm text-gray-700">
                  조정대상지역 주택 (서울 전역 등)
                </label>
              </div>
            </>
          )}

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

          <div className="bg-blue-50 rounded-lg p-4 text-center mb-6">
            <p className="text-sm text-blue-600 font-medium mb-1">총 납부 세금</p>
            <p className="text-3xl font-bold text-blue-700">{formatKRW(result.totalTax)}</p>
            <p className="text-sm text-blue-500 mt-1">
              취득가액의 {result.effectiveRate.toFixed(2)}%
            </p>
          </div>

          <h3 className="font-medium text-gray-700 mb-3">세금 내역</h3>
          <div className="space-y-2">
            {result.breakdown.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-xs text-gray-400 ml-2">({item.rate})</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{formatKRW(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 bg-blue-50 rounded-lg px-3 mt-2">
              <span className="text-sm font-semibold text-blue-700">총 납부액</span>
              <span className="text-sm font-bold text-blue-700">{formatKRW(result.totalTax)}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 취득세율은 주택 면적(85㎡ 초과 여부) 및 개인 상황에 따라 다를 수 있습니다. 본 계산 결과는 참고용입니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
