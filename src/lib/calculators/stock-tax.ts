export type StockType = "domestic" | "us" | "domestic_etf" | "overseas_etf";

export const STOCK_TYPE_LABELS: Record<StockType, string> = {
  domestic: "국내 주식",
  us: "미국 주식",
  domestic_etf: "국내 상장 ETF (주식형)",
  overseas_etf: "해외 상장 ETF",
};

export interface StockTaxInput {
  stockType: StockType;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  commissionRate: number;
  exchangeRate?: number;
  isDividend?: boolean;
  dividendAmount?: number;
  isMajorShareholder?: boolean;
}

export interface StockTaxResult {
  stockType: StockType;
  totalBuy: number;
  totalSell: number;
  grossProfit: number;
  buyCommission: number;
  sellCommission: number;
  transactionTax: number;
  transactionTaxRate: number;
  capitalGainsTax: number;
  capitalGainsTaxRate: number;
  capitalGainsExemption: number;
  localIncomeTax: number;
  dividendTax: number;
  totalCosts: number;
  netProfit: number;
  returnRate: number;
}

const DOMESTIC_TRANSACTION_TAX_RATE = 0.0018;
const OVERSEAS_CAPITAL_GAINS_TAX_RATE = 0.2;
const OVERSEAS_LOCAL_INCOME_TAX_RATE = 0.02;
const OVERSEAS_EXEMPTION = 2_500_000;
const MAJOR_SHAREHOLDER_TAX_RATE_LOW = 0.2;
const MAJOR_SHAREHOLDER_TAX_RATE_HIGH = 0.25;
const MAJOR_SHAREHOLDER_THRESHOLD = 300_000_000;
const DIVIDEND_TAX_RATE = 0.154;
const US_DIVIDEND_WITHHOLDING_RATE = 0.15;

export function calculateStockTax(input: StockTaxInput): StockTaxResult {
  const totalBuy = input.buyPrice * input.quantity;
  const totalSell = input.sellPrice * input.quantity;
  const grossProfit = totalSell - totalBuy;

  const commissionRate = input.commissionRate / 100;
  const buyCommission = Math.round(totalBuy * commissionRate);
  const sellCommission = Math.round(totalSell * commissionRate);

  let transactionTax = 0;
  let transactionTaxRate = 0;
  let capitalGainsTax = 0;
  let capitalGainsTaxRate = 0;
  let capitalGainsExemption = 0;
  let localIncomeTax = 0;
  let dividendTax = 0;

  switch (input.stockType) {
    case "domestic": {
      transactionTaxRate = DOMESTIC_TRANSACTION_TAX_RATE;
      transactionTax = Math.round(totalSell * transactionTaxRate);

      if (input.isMajorShareholder && grossProfit > 0) {
        if (grossProfit <= MAJOR_SHAREHOLDER_THRESHOLD) {
          capitalGainsTaxRate = MAJOR_SHAREHOLDER_TAX_RATE_LOW;
        } else {
          capitalGainsTaxRate = MAJOR_SHAREHOLDER_TAX_RATE_HIGH;
        }
        capitalGainsTax = Math.round(grossProfit * capitalGainsTaxRate);
        localIncomeTax = Math.round(capitalGainsTax * 0.1);
      }

      if (input.isDividend && input.dividendAmount) {
        dividendTax = Math.round(input.dividendAmount * DIVIDEND_TAX_RATE);
      }
      break;
    }

    case "us": {
      if (grossProfit > 0) {
        capitalGainsExemption = OVERSEAS_EXEMPTION;
        const taxableGain = Math.max(grossProfit - capitalGainsExemption, 0);
        capitalGainsTaxRate = OVERSEAS_CAPITAL_GAINS_TAX_RATE;
        capitalGainsTax = Math.round(taxableGain * capitalGainsTaxRate);
        localIncomeTax = Math.round(taxableGain * OVERSEAS_LOCAL_INCOME_TAX_RATE);
      }

      if (input.isDividend && input.dividendAmount) {
        dividendTax = Math.round(input.dividendAmount * US_DIVIDEND_WITHHOLDING_RATE);
      }
      break;
    }

    case "domestic_etf": {
      transactionTaxRate = 0;
      transactionTax = 0;

      if (input.isDividend && input.dividendAmount) {
        dividendTax = Math.round(input.dividendAmount * DIVIDEND_TAX_RATE);
      }
      break;
    }

    case "overseas_etf": {
      if (grossProfit > 0) {
        capitalGainsExemption = OVERSEAS_EXEMPTION;
        const taxableGain = Math.max(grossProfit - capitalGainsExemption, 0);
        capitalGainsTaxRate = OVERSEAS_CAPITAL_GAINS_TAX_RATE;
        capitalGainsTax = Math.round(taxableGain * capitalGainsTaxRate);
        localIncomeTax = Math.round(taxableGain * OVERSEAS_LOCAL_INCOME_TAX_RATE);
      }

      if (input.isDividend && input.dividendAmount) {
        dividendTax = Math.round(input.dividendAmount * US_DIVIDEND_WITHHOLDING_RATE);
      }
      break;
    }
  }

  const totalCosts =
    buyCommission + sellCommission + transactionTax + capitalGainsTax + localIncomeTax + dividendTax;
  const netProfit = grossProfit - totalCosts;
  const returnRate = totalBuy > 0 ? (netProfit / totalBuy) * 100 : 0;

  return {
    stockType: input.stockType,
    totalBuy,
    totalSell,
    grossProfit,
    buyCommission,
    sellCommission,
    transactionTax,
    transactionTaxRate,
    capitalGainsTax,
    capitalGainsTaxRate,
    capitalGainsExemption,
    localIncomeTax,
    dividendTax,
    totalCosts,
    netProfit,
    returnRate,
  };
}
