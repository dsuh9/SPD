"use client";

import { useState } from "react";
import {
  convertJeonseToWolse,
  convertWolseToJeonse,
  LEGAL_CONVERSION_RATE,
  type JeonseToWolseResult,
  type WolseToJeonseResult,
} from "@/lib/calculators/jeonse-wolse";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

type Mode = "jeonseToWolse" | "wolseToJeonse";

export default function JeonseWolseCalculator() {
  const [mode, setMode] = useState<Mode>("jeonseToWolse");
  const [jeonseAmount, setJeonseAmount] = useState("");
  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [conversionRate, setConversionRate] = useState(String(LEGAL_CONVERSION_RATE));
  const [result, setResult] = useState<JeonseToWolseResult | WolseToJeonseResult | null>(null);

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function handleCalculate() {
    const rate = parseFloat(conversionRate) || LEGAL_CONVERSION_RATE;

    if (mode === "jeonseToWolse") {
      const jeonse = parseInt(jeonseAmount.replace(/,/g, ""), 10);
      const dep = parseInt(deposit.replace(/,/g, "") || "0", 10);
      if (!jeonse || jeonse <= 0) return;
      setResult(convertJeonseToWolse(jeonse, dep, rate));
    } else {
      const dep = parseInt(deposit.replace(/,/g, "") || "0", 10);
      const rent = parseInt(monthlyRent.replace(/,/g, ""), 10);
      if (!rent || rent <= 0) return;
      setResult(convertWolseToJeonse(dep, rent, rate));
    }
    trackCalculatorUse("jeonse_wolse", { mode });
  }

  function handleModeChange(m: Mode) {
    setMode(m);
    setJeonseAmount("");
    setDeposit("");
    setMonthlyRent("");
    setResult(null);
  }

  const isJeonseResult = (r: JeonseToWolseResult | WolseToJeonseResult): r is JeonseToWolseResult =>
    "jeonseAmount" in r;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">전환 방향 선택</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleModeChange("jeonseToWolse")}
            className={`py-4 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              mode === "jeonseToWolse"
                ? "bg-sky-50 border-sky-500 text-sky-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="text-base font-semibold mb-1">전세 → 월세</div>
            <div className="text-xs opacity-70">전세금을 월세로 전환</div>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("wolseToJeonse")}
            className={`py-4 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              mode === "wolseToJeonse"
                ? "bg-sky-50 border-sky-500 text-sky-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="text-base font-semibold mb-1">월세 → 전세</div>
            <div className="text-xs opacity-70">월세를 전세 환산금으로 전환</div>
          </button>
        </div>

        <div className="space-y-4">
          {mode === "jeonseToWolse" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전세금 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={jeonseAmount}
                  onChange={(e) => setJeonseAmount(formatInput(e.target.value))}
                  placeholder="전세금을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-right pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              보증금 {mode === "jeonseToWolse" && "(월세 전환 시 보증금)"}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={deposit}
                onChange={(e) => setDeposit(formatInput(e.target.value))}
                placeholder="보증금을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
            </div>
          </div>

          {mode === "wolseToJeonse" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                월세 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(formatInput(e.target.value))}
                  placeholder="월세를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-right pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전환율 (%) — 법정 전환율: {LEGAL_CONVERSION_RATE}%
            </label>
            <input
              type="number"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-right"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors text-base"
          >
            계산하기
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h2>

          <div className="space-y-3">
            {isJeonseResult(result) ? (
              <>
                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">전세금</span>
                  <span className="text-lg font-bold text-gray-800">{formatKRW(result.jeonseAmount)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">보증금</span>
                  <span className="text-lg font-bold text-gray-800">{formatKRW(result.deposit)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-sky-50 border-2 border-sky-200">
                  <span className="text-sm font-medium text-gray-700">월세</span>
                  <span className="text-xl font-bold text-sky-700">{formatKRW(result.monthlyRent)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">연 임대료</span>
                  <span className="text-lg font-bold text-gray-800">{formatKRW(result.yearlyRent)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">보증금</span>
                  <span className="text-lg font-bold text-gray-800">{formatKRW(result.deposit)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">월세</span>
                  <span className="text-lg font-bold text-gray-800">{formatKRW(result.monthlyRent)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-sky-50 border-2 border-sky-200">
                  <span className="text-sm font-medium text-gray-700">전세 환산금</span>
                  <span className="text-xl font-bold text-sky-700">{formatKRW(result.equivalentJeonse)}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              * 법정 전환율({LEGAL_CONVERSION_RATE}%)은 한국은행 기준금리 + 2%로 산정됩니다. 실제 전환율은 임대인과 합의에 따라 달라질 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
