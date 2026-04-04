"use client";

import { useState } from "react";
import { calculateCapitalGains, CapitalGainsResult } from "@/lib/calculators/capital-gains";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

export default function CapitalGainsCalculator() {
  const [transferPrice, setTransferPrice] = useState("");
  const [acquisitionPrice, setAcquisitionPrice] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState("");
  const [transferCost, setTransferCost] = useState("");
  const [holdingYears, setHoldingYears] = useState("3");
  const [residenceYears, setResidenceYears] = useState("0");
  const [ownedHouses, setOwnedHouses] = useState("1");
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [propertyType, setPropertyType] = useState<"house" | "land" | "other">("house");
  const [result, setResult] = useState<CapitalGainsResult | null>(null);

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function handleCalculate() {
    const tp = parseInt(transferPrice.replace(/,/g, ""), 10);
    const ap = parseInt(acquisitionPrice.replace(/,/g, ""), 10);
    if (!tp || !ap) return;

    const res = calculateCapitalGains({
      transferPrice: tp,
      acquisitionPrice: ap,
      acquisitionCost: parseInt(acquisitionCost.replace(/,/g, ""), 10) || 0,
      transferCost: parseInt(transferCost.replace(/,/g, ""), 10) || 0,
      holdingYears: parseInt(holdingYears, 10),
      residenceYears: parseInt(residenceYears, 10),
      ownedHouses: parseInt(ownedHouses, 10),
      isAdjustedArea: isAdjusted,
      propertyType,
    });
    setResult(res);
    trackCalculatorUse("capital_gains", { property_type: propertyType });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 정보 입력</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">자산 유형</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "house", label: "주택" },
                { value: "land", label: "토지" },
                { value: "other", label: "기타" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setPropertyType(item.value as "house" | "land" | "other")}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">양도가액 *</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={transferPrice}
                  onChange={(e) => setTransferPrice(formatInput(e.target.value))}
                  placeholder="양도 금액"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-8 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">취득가액 *</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={acquisitionPrice}
                  onChange={(e) => setAcquisitionPrice(formatInput(e.target.value))}
                  placeholder="취득 금액"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-8 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">취득 필요경비</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={acquisitionCost}
                  onChange={(e) => setAcquisitionCost(formatInput(e.target.value))}
                  placeholder="취득세 등"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-8 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">양도 필요경비</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={transferCost}
                  onChange={(e) => setTransferCost(formatInput(e.target.value))}
                  placeholder="중개수수료 등"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-8 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">원</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">보유기간 (년)</label>
              <input
                type="number"
                min="0"
                max="30"
                value={holdingYears}
                onChange={(e) => setHoldingYears(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {propertyType === "house" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">거주기간 (년)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={residenceYears}
                  onChange={(e) => setResidenceYears(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {propertyType === "house" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">양도 시 보유 주택 수</label>
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

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="adjusted-cg"
                  checked={isAdjusted}
                  onChange={(e) => setIsAdjusted(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="adjusted-cg" className="text-sm text-gray-700">
                  조정대상지역 주택
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

          {result.isExempt ? (
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700 mb-2">비과세</p>
              <p className="text-sm text-green-600">{result.exemptNote}</p>
            </div>
          ) : (
            <>
              <div className="bg-red-50 rounded-lg p-4 text-center mb-6">
                <p className="text-sm text-red-600 font-medium mb-1">총 납부 세금</p>
                <p className="text-3xl font-bold text-red-700">{formatKRW(result.totalTax)}</p>
              </div>

              <div className="space-y-2">
                {[
                  { label: "양도차익", amount: result.transferGain, highlight: false },
                  { label: `장기보유특별공제 (${result.longTermDeductionRate}%)`, amount: -result.longTermDeduction, highlight: false },
                  { label: "기본공제 (250만원)", amount: -result.basicDeduction, highlight: false },
                  { label: "과세표준", amount: result.taxBase, highlight: true },
                  { label: `양도소득세 (${result.taxRate}%)`, amount: result.capitalGainsTax, highlight: false },
                  { label: "지방소득세 (10%)", amount: result.localIncomeTax, highlight: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${
                      item.highlight ? "bg-gray-50 rounded px-2" : ""
                    }`}
                  >
                    <span className={`text-sm ${item.highlight ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                      {item.label}
                    </span>
                    <span className={`text-sm font-medium ${item.amount < 0 ? "text-green-600" : "text-gray-800"}`}>
                      {item.amount < 0 ? `- ${formatKRW(Math.abs(item.amount))}` : formatKRW(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 bg-red-50 rounded-lg px-3 mt-2">
                  <span className="text-sm font-semibold text-red-700">총 납부세액</span>
                  <span className="text-sm font-bold text-red-700">{formatKRW(result.totalTax)}</span>
                </div>
              </div>
            </>
          )}

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 본 계산은 간이 계산으로 실제 세금과 다를 수 있습니다. 정확한 양도세는 세무사 상담을 통해 확인하세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
