"use client";

import { useState } from "react";
import {
  calculateStockTax,
  STOCK_TYPE_LABELS,
  type StockType,
  type StockTaxResult,
} from "@/lib/calculators/stock-tax";
import { formatKRW, formatNumber } from "@/lib/utils";
import { trackCalculatorUse } from "@/lib/analytics";

export default function StockTaxCalculator() {
  const [stockType, setStockType] = useState<StockType>("domestic");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [commissionRate, setCommissionRate] = useState("0.015");
  const [isMajorShareholder, setIsMajorShareholder] = useState(false);
  const [isDividend, setIsDividend] = useState(false);
  const [dividendAmount, setDividendAmount] = useState("");
  const [result, setResult] = useState<StockTaxResult | null>(null);

  function formatInput(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    return num ? formatNumber(parseInt(num, 10)) : "";
  }

  function parseAmount(value: string): number {
    return parseInt(value.replace(/,/g, "") || "0", 10);
  }

  function handleCalculate() {
    const buy = parseAmount(buyPrice);
    const sell = parseAmount(sellPrice);
    const qty = parseInt(quantity.replace(/,/g, "") || "0", 10);
    if (!buy || !sell || !qty) return;

    const res = calculateStockTax({
      stockType,
      buyPrice: buy,
      sellPrice: sell,
      quantity: qty,
      commissionRate: parseFloat(commissionRate) || 0,
      isMajorShareholder,
      isDividend,
      dividendAmount: parseAmount(dividendAmount),
    });
    setResult(res);
    trackCalculatorUse("stock_tax", { stockType, buy, sell, qty });
  }

  function handleTypeChange(t: StockType) {
    setStockType(t);
    setResult(null);
    setIsMajorShareholder(false);
  }

  const stockTypes: { type: StockType; desc: string }[] = [
    { type: "domestic", desc: "코스피·코스닥 개별 종목" },
    { type: "us", desc: "NYSE·NASDAQ 등 미국 상장" },
    { type: "domestic_etf", desc: "국내 상장 주식형 ETF" },
    { type: "overseas_etf", desc: "미국 등 해외 상장 ETF" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">투자 종류 선택</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {stockTypes.map((s) => (
            <button
              key={s.type}
              type="button"
              onClick={() => handleTypeChange(s.type)}
              className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors text-left ${
                stockType === s.type
                  ? "bg-lime-50 border-lime-500 text-lime-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-semibold mb-0.5">{STOCK_TYPE_LABELS[s.type]}</div>
              <div className="text-xs opacity-70">{s.desc}</div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매수 단가 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(formatInput(e.target.value))}
                  placeholder="매수가"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-right pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매도 단가 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(formatInput(e.target.value))}
                  placeholder="매도가"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-right pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              수량 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => {
                  const num = e.target.value.replace(/[^0-9]/g, "");
                  setQuantity(num ? formatNumber(parseInt(num, 10)) : "");
                }}
                placeholder="매매 수량"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-right pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">주</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              매매 수수료율 (%)
            </label>
            <input
              type="number"
              step="0.001"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-right"
            />
            <p className="text-xs text-gray-400 mt-1">일반적으로 MTS 0.01~0.015%, HTS 0.015~0.05%</p>
          </div>

          {stockType === "domestic" && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isMajorShareholder}
                onChange={(e) => setIsMajorShareholder(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
              />
              대주주 (지분 1% 이상 또는 종목별 10억원 이상 보유)
            </label>
          )}

          <div className="border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-3">
              <input
                type="checkbox"
                checked={isDividend}
                onChange={(e) => setIsDividend(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
              />
              배당금 포함 계산
            </label>

            {isDividend && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배당금 (세전)</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={dividendAmount}
                    onChange={(e) => setDividendAmount(formatInput(e.target.value))}
                    placeholder="총 배당금"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-right pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-lime-600 text-white py-3 rounded-lg font-semibold hover:bg-lime-700 transition-colors text-base"
          >
            계산하기
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">계산 결과</h2>
          <p className="text-sm text-gray-500 mb-4">{STOCK_TYPE_LABELS[result.stockType]}</p>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">총 매수 금액</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.totalBuy)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">총 매도 금액</span>
              <span className="text-lg font-bold text-gray-800">{formatKRW(result.totalSell)}</span>
            </div>
            <div className={`flex justify-between items-center p-4 rounded-lg ${result.grossProfit >= 0 ? "bg-green-50" : "bg-red-50"}`}>
              <span className="text-sm font-medium text-gray-700">매매 차익</span>
              <span className={`text-lg font-bold ${result.grossProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                {result.grossProfit >= 0 ? "+" : ""}{formatKRW(result.grossProfit)}
              </span>
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-700 mt-6 mb-3">비용 내역</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-700">매수 수수료</span>
              <span className="text-sm font-bold text-gray-800">-{formatKRW(result.buyCommission)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-700">매도 수수료</span>
              <span className="text-sm font-bold text-gray-800">-{formatKRW(result.sellCommission)}</span>
            </div>

            {result.transactionTax > 0 && (
              <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50">
                <span className="text-sm text-gray-700">증권거래세 ({(result.transactionTaxRate * 100).toFixed(2)}%)</span>
                <span className="text-sm font-bold text-orange-700">-{formatKRW(result.transactionTax)}</span>
              </div>
            )}

            {result.capitalGainsTax > 0 && (
              <>
                {result.capitalGainsExemption > 0 && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
                    <span className="text-sm text-gray-700">기본공제</span>
                    <span className="text-sm font-bold text-blue-700">{formatKRW(result.capitalGainsExemption)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
                  <span className="text-sm text-gray-700">양도소득세 ({(result.capitalGainsTaxRate * 100)}%)</span>
                  <span className="text-sm font-bold text-red-700">-{formatKRW(result.capitalGainsTax)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
                  <span className="text-sm text-gray-700">지방소득세 (양도세의 10%)</span>
                  <span className="text-sm font-bold text-red-700">-{formatKRW(result.localIncomeTax)}</span>
                </div>
              </>
            )}

            {result.dividendTax > 0 && (
              <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50">
                <span className="text-sm text-gray-700">배당소득세</span>
                <span className="text-sm font-bold text-purple-700">-{formatKRW(result.dividendTax)}</span>
              </div>
            )}

            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100">
              <span className="text-sm font-medium text-gray-700">총 비용 합계</span>
              <span className="text-base font-bold text-gray-800">-{formatKRW(result.totalCosts)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div
              className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                result.netProfit >= 0
                  ? "bg-lime-50 border-lime-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <span className="text-sm font-medium text-gray-700">순수익 (세후)</span>
              <div className="text-right">
                <span className={`text-xl font-bold ${result.netProfit >= 0 ? "text-lime-700" : "text-red-700"}`}>
                  {result.netProfit >= 0 ? "+" : ""}{formatKRW(result.netProfit)}
                </span>
                <p className={`text-sm ${result.returnRate >= 0 ? "text-lime-600" : "text-red-600"}`}>
                  수익률 {result.returnRate >= 0 ? "+" : ""}{result.returnRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              {result.stockType === "domestic" && result.capitalGainsTax === 0
                ? "* 일반 개인 투자자는 국내 주식 매매 차익에 대한 양도소득세가 비과세입니다. 대주주에 해당하면 양도소득세가 부과됩니다."
                : result.stockType === "domestic_etf"
                ? "* 국내 상장 주식형 ETF의 매매 차익은 비과세이며, 증권거래세도 면제됩니다. 분배금에만 배당소득세 15.4%가 적용됩니다."
                : "* 해외 주식/ETF 양도소득세는 연간 기본공제 250만원이 적용됩니다. 연간 합산 기준이므로 다른 해외 주식 거래와 합산됩니다."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
