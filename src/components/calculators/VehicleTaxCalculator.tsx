"use client";

import { useState } from "react";
import { calculateVehicleTax, type VehicleTaxResult } from "@/lib/calculators/vehicle-tax";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

export default function VehicleTaxCalculator() {
  const [displacement, setDisplacement] = useState("");
  const [vehicleAge, setVehicleAge] = useState("0");
  const [isCommercial, setIsCommercial] = useState(false);
  const [isElectric, setIsElectric] = useState(false);
  const [result, setResult] = useState<VehicleTaxResult | null>(null);

  function handleCalculate() {
    const cc = parseInt(displacement.replace(/,/g, ""), 10);
    const age = parseInt(vehicleAge, 10) || 0;
    if (!isElectric && (!cc || cc <= 0)) return;

    setResult(calculateVehicleTax(isElectric ? 0 : cc, age, isCommercial, isElectric));
    trackCalculatorUse("vehicle_tax", { displacement: cc, age, isElectric });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">차량 정보</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isElectric}
              onChange={(e) => setIsElectric(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            전기차
          </label>

          {!isElectric && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  배기량 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displacement}
                    onChange={(e) => {
                      const num = e.target.value.replace(/[^0-9]/g, "");
                      setDisplacement(num ? formatNumber(parseInt(num, 10)) : "");
                    }}
                    placeholder="배기량을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-right pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cc</span>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={isCommercial}
                  onChange={(e) => setIsCommercial(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                />
                영업용 차량
              </label>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">차령 (년)</label>
            <input
              type="number"
              min="0"
              max="30"
              value={vehicleAge}
              onChange={(e) => setVehicleAge(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-center"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors text-base"
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
              <span className="text-sm font-medium text-gray-700">차량 유형</span>
              <span className="text-lg font-bold text-gray-800">{result.vehicleType}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">자동차세 (본세)</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.annualTax)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">지방교육세 (30%)</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.localEducationTax)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">연간 합계</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.totalAnnualTax)}</span>
            </div>

            {result.ageDiscount > 0 && (
              <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50">
                <span className="text-sm font-medium text-gray-700">차령 경감</span>
                <span className="text-lg font-bold text-blue-700">-{formatKRW(result.ageDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center p-4 rounded-lg bg-rose-50 border-2 border-rose-200">
              <span className="text-sm font-medium text-gray-700">실제 연간 세액</span>
              <span className="text-xl font-bold text-rose-700">{formatKRW(result.discountedTax)}</span>
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">1월 연납 시</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">연납 할인 (약 4.58%)</span>
                <span className="text-lg font-bold text-rose-700">{formatKRW(result.earlyPaymentTotal)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                할인액: -{formatKRW(result.earlyPaymentDiscount)}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 자동차세는 매년 6월과 12월에 각각 절반씩 부과됩니다. 1월에 연납 신청하면 할인 혜택을 받을 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
