"use client";

import { useState } from "react";
import { calculatePropertyTax, PropertyTaxResult } from "@/lib/calculators/property-tax";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

export default function PropertyTaxCalculator() {
  const [publicPrice, setPublicPrice] = useState("");
  const [propertyType, setPropertyType] = useState<"house" | "land_aggregate" | "land_separate">("house");
  const [ownedHouses, setOwnedHouses] = useState("1");
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [isJoint, setIsJoint] = useState(false);
  const [age, setAge] = useState("50");
  const [holdingYears, setHoldingYears] = useState("5");
  const [result, setResult] = useState<PropertyTaxResult | null>(null);

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function handleCalculate() {
    const pp = parseInt(publicPrice.replace(/,/g, ""), 10);
    if (!pp || pp <= 0) return;

    const res = calculatePropertyTax({
      publicPrice: pp,
      propertyType,
      ownedHouses: parseInt(ownedHouses, 10),
      isAdjustedArea: isAdjusted,
      isJointOwnership: isJoint,
      age: parseInt(age, 10),
      holdingYears: parseInt(holdingYears, 10),
    });
    setResult(res);
    trackCalculatorUse("property_tax", { property_type: propertyType });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 정보 입력</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              공시가격 합계 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={publicPrice}
                onChange={(e) => setPublicPrice(formatInput(e.target.value))}
                placeholder="예: 1,500,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">보유 부동산의 공시가격 합계 (국토부 공시가격 기준)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">부동산 유형</label>
            <div className="space-y-2">
              {[
                { value: "house", label: "주택 (아파트, 단독주택 등)" },
                { value: "land_aggregate", label: "종합합산 토지 (나대지 등)" },
                { value: "land_separate", label: "별도합산 토지 (상업용 건물 부속토지 등)" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setPropertyType(item.value as "house" | "land_aggregate" | "land_separate")}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium border transition-colors text-left ${
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
                <label className="block text-sm font-medium text-gray-700 mb-1">보유 주택 수</label>
                <select
                  value={ownedHouses}
                  onChange={(e) => setOwnedHouses(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n}채</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
                  <input
                    type="number"
                    min="20"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">60세 이상 고령자 공제</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">보유기간 (년)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={holdingYears}
                    onChange={(e) => setHoldingYears(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">5년 이상 장기보유 공제</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="adjusted-pt"
                    checked={isAdjusted}
                    onChange={(e) => setIsAdjusted(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="adjusted-pt" className="text-sm text-gray-700">
                    조정대상지역 주택 포함
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="joint-pt"
                    checked={isJoint}
                    onChange={(e) => setIsJoint(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="joint-pt" className="text-sm text-gray-700">
                    공동명의 1주택 (9억 공제 적용)
                  </label>
                </div>
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

          <div className="bg-purple-50 rounded-lg p-4 text-center mb-6">
            <p className="text-sm text-purple-600 font-medium mb-1">총 납부 세금</p>
            <p className="text-3xl font-bold text-purple-700">{formatKRW(result.totalTax)}</p>
          </div>

          <div className="space-y-2 mb-4">
            {result.breakdown.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>

          {propertyType === "house" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">종합부동산세 (산출)</span>
                <span className="text-sm font-medium">{formatKRW(result.calculatedTax)}</span>
              </div>
              {result.personalDeductionRate > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">개인 공제 ({result.personalDeductionRate}%)</span>
                  <span className="text-sm font-medium text-green-600">
                    - {formatKRW(result.calculatedTax - result.deductedTax)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">종합부동산세 (최종)</span>
                <span className="text-sm font-medium">{formatKRW(result.deductedTax)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">농어촌특별세 (20%)</span>
                <span className="text-sm font-medium">{formatKRW(result.agricultureTax)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-purple-50 rounded-lg px-3">
                <span className="text-sm font-semibold text-purple-700">총 납부액</span>
                <span className="text-sm font-bold text-purple-700">{formatKRW(result.totalTax)}</span>
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 종합부동산세는 재산세와 함께 고지되며, 재산세 공제 후 납부합니다. 본 계산에는 재산세 공제가 반영되지 않았습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
