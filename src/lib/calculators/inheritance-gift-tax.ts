export interface InheritanceResult {
  taxableAmount: number;
  deduction: number;
  taxBase: number;
  calculatedTax: number;
  generationSkipSurcharge: number;
  reportDiscount: number;
  finalTax: number;
}

export interface GiftResult {
  giftAmount: number;
  exemption: number;
  taxBase: number;
  calculatedTax: number;
  generationSkipSurcharge: number;
  reportDiscount: number;
  finalTax: number;
}

const TAX_BRACKETS = [
  { limit: 100_000_000, rate: 0.1, deduction: 0 },
  { limit: 500_000_000, rate: 0.2, deduction: 10_000_000 },
  { limit: 1_000_000_000, rate: 0.3, deduction: 60_000_000 },
  { limit: 3_000_000_000, rate: 0.4, deduction: 160_000_000 },
  { limit: Infinity, rate: 0.5, deduction: 460_000_000 },
];

const GIFT_EXEMPTIONS: Record<string, number> = {
  spouse: 600_000_000,
  lineal_ascendant: 50_000_000,
  lineal_descendant: 50_000_000,
  minor_descendant: 20_000_000,
  other_relative: 10_000_000,
  other: 0,
};

export const GIFT_RELATIONSHIP_LABELS: Record<string, string> = {
  spouse: "배우자",
  lineal_ascendant: "직계존속 (부모 등)",
  lineal_descendant: "직계비속 (성인 자녀)",
  minor_descendant: "직계비속 (미성년 자녀)",
  other_relative: "기타 친족",
  other: "기타",
};

function calculateProgressiveTax(taxBase: number): number {
  if (taxBase <= 0) return 0;
  const bracket = TAX_BRACKETS.find((b) => taxBase <= b.limit)!;
  return Math.round(taxBase * bracket.rate - bracket.deduction);
}

export function calculateInheritanceTax(
  totalAssets: number,
  deduction: number,
  isGenerationSkip: boolean
): InheritanceResult {
  const taxBase = Math.max(totalAssets - deduction, 0);
  const calculatedTax = calculateProgressiveTax(taxBase);
  const generationSkipSurcharge = isGenerationSkip
    ? Math.round(calculatedTax * 0.3)
    : 0;
  const beforeDiscount = calculatedTax + generationSkipSurcharge;
  const reportDiscount = Math.round(beforeDiscount * 0.03);
  const finalTax = Math.max(beforeDiscount - reportDiscount, 0);

  return {
    taxableAmount: totalAssets,
    deduction,
    taxBase,
    calculatedTax,
    generationSkipSurcharge,
    reportDiscount,
    finalTax,
  };
}

export function calculateGiftTax(
  giftAmount: number,
  relationship: string,
  isGenerationSkip: boolean
): GiftResult {
  const exemption = GIFT_EXEMPTIONS[relationship] ?? 0;
  const taxBase = Math.max(giftAmount - exemption, 0);
  const calculatedTax = calculateProgressiveTax(taxBase);
  const generationSkipSurcharge = isGenerationSkip
    ? Math.round(calculatedTax * 0.3)
    : 0;
  const beforeDiscount = calculatedTax + generationSkipSurcharge;
  const reportDiscount = Math.round(beforeDiscount * 0.03);
  const finalTax = Math.max(beforeDiscount - reportDiscount, 0);

  return {
    giftAmount,
    exemption,
    taxBase,
    calculatedTax,
    generationSkipSurcharge,
    reportDiscount,
    finalTax,
  };
}
