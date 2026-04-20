export interface JeonseToWolseResult {
  jeonseAmount: number;
  deposit: number;
  monthlyRent: number;
  conversionRate: number;
  yearlyRent: number;
}

export interface WolseToJeonseResult {
  deposit: number;
  monthlyRent: number;
  equivalentJeonse: number;
  conversionRate: number;
}

export const LEGAL_CONVERSION_RATE = 2.5;

export function convertJeonseToWolse(
  jeonseAmount: number,
  deposit: number,
  conversionRate: number
): JeonseToWolseResult {
  const diff = Math.max(jeonseAmount - deposit, 0);
  const yearlyRent = Math.round(diff * (conversionRate / 100));
  const monthlyRent = Math.round(yearlyRent / 12);

  return {
    jeonseAmount,
    deposit,
    monthlyRent,
    conversionRate,
    yearlyRent,
  };
}

export function convertWolseToJeonse(
  deposit: number,
  monthlyRent: number,
  conversionRate: number
): WolseToJeonseResult {
  const yearlyRent = monthlyRent * 12;
  const convertedAmount =
    conversionRate > 0 ? Math.round(yearlyRent / (conversionRate / 100)) : 0;
  const equivalentJeonse = deposit + convertedAmount;

  return {
    deposit,
    monthlyRent,
    equivalentJeonse,
    conversionRate,
  };
}
