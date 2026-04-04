// 2025년 기준 양도소득세 계산기

export interface CapitalGainsInput {
  acquisitionPrice: number; // 취득가액 (원)
  transferPrice: number; // 양도가액 (원)
  acquisitionCost: number; // 필요경비 - 취득 시 (원)
  transferCost: number; // 필요경비 - 양도 시 (원)
  holdingYears: number; // 보유기간 (년)
  residenceYears: number; // 거주기간 (년) - 1세대1주택 비과세용
  ownedHouses: number; // 양도 시 보유 주택 수
  isAdjustedArea: boolean; // 조정대상지역 여부
  propertyType: 'house' | 'land' | 'other'; // 자산 유형
}

export interface CapitalGainsResult {
  transferPrice: number;
  acquisitionPrice: number;
  necessaryCosts: number; // 필요경비
  transferGain: number; // 양도차익
  longTermDeductionRate: number; // 장기보유특별공제율 (%)
  longTermDeduction: number; // 장기보유특별공제액
  basicDeduction: number; // 기본공제 (250만원)
  taxBase: number; // 과세표준
  taxRate: number; // 세율 (%)
  capitalGainsTax: number; // 양도소득세
  localIncomeTax: number; // 지방소득세
  totalTax: number; // 총 세금
  isExempt: boolean; // 1세대1주택 비과세 여부
  exemptNote?: string; // 비과세 사유
}

function getLongTermDeductionRate(
  holdingYears: number,
  residenceYears: number,
  propertyType: string,
  ownedHouses: number
): number {
  if (propertyType !== 'house' || ownedHouses !== 1) {
    // 일반 장기보유특별공제 (토지, 다주택)
    if (holdingYears < 3) return 0;
    if (holdingYears < 4) return 6;
    if (holdingYears < 5) return 8;
    if (holdingYears < 6) return 10;
    if (holdingYears < 7) return 12;
    if (holdingYears < 8) return 14;
    if (holdingYears < 9) return 16;
    if (holdingYears < 10) return 18;
    if (holdingYears < 11) return 20;
    if (holdingYears < 12) return 22;
    if (holdingYears < 13) return 24;
    if (holdingYears < 14) return 26;
    if (holdingYears < 15) return 28;
    return 30;
  }

  // 1세대 1주택 장기보유특별공제 (보유 + 거주 각각 적용)
  // 보유기간 공제 + 거주기간 공제 합산
  let holdingRate = 0;
  let residenceRate = 0;

  if (holdingYears >= 3) {
    holdingRate = Math.min((holdingYears - 2) * 4, 40); // 최대 40%
  }
  if (residenceYears >= 2) {
    residenceRate = Math.min((residenceYears - 1) * 4, 40); // 최대 40%
  }

  return Math.min(holdingRate + residenceRate, 80); // 최대 80%
}

function getTaxRate(taxBase: number, holdingYears: number, ownedHouses: number, isAdjustedArea: boolean): number {
  // 단기 양도: 보유 1년 미만 70%, 2년 미만 60%
  if (holdingYears < 1) return 70;
  if (holdingYears < 2) return 60;

  // 다주택자 중과세 (조정대상지역)
  if (isAdjustedArea && ownedHouses >= 2) {
    // 2주택: 기본세율 + 20%, 3주택 이상: 기본세율 + 30%
    const surcharge = ownedHouses === 2 ? 20 : 30;
    const baseRate = getProgressiveTaxRate(taxBase);
    return Math.min(baseRate + surcharge, 75);
  }

  return getProgressiveTaxRate(taxBase);
}

function getProgressiveTaxRate(taxBase: number): number {
  if (taxBase <= 14_000_000) return 6;
  if (taxBase <= 50_000_000) return 15;
  if (taxBase <= 88_000_000) return 24;
  if (taxBase <= 150_000_000) return 35;
  if (taxBase <= 300_000_000) return 38;
  if (taxBase <= 500_000_000) return 40;
  if (taxBase <= 1_000_000_000) return 42;
  return 45;
}

function calculateProgressiveTax(taxBase: number): number {
  let tax = 0;
  if (taxBase <= 14_000_000) {
    tax = taxBase * 0.06;
  } else if (taxBase <= 50_000_000) {
    tax = 840_000 + (taxBase - 14_000_000) * 0.15;
  } else if (taxBase <= 88_000_000) {
    tax = 6_240_000 + (taxBase - 50_000_000) * 0.24;
  } else if (taxBase <= 150_000_000) {
    tax = 15_360_000 + (taxBase - 88_000_000) * 0.35;
  } else if (taxBase <= 300_000_000) {
    tax = 37_060_000 + (taxBase - 150_000_000) * 0.38;
  } else if (taxBase <= 500_000_000) {
    tax = 94_060_000 + (taxBase - 300_000_000) * 0.40;
  } else if (taxBase <= 1_000_000_000) {
    tax = 174_060_000 + (taxBase - 500_000_000) * 0.42;
  } else {
    tax = 384_060_000 + (taxBase - 1_000_000_000) * 0.45;
  }
  return tax;
}

export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsResult {
  const {
    acquisitionPrice,
    transferPrice,
    acquisitionCost,
    transferCost,
    holdingYears,
    residenceYears,
    ownedHouses,
    isAdjustedArea,
    propertyType,
  } = input;

  // 1세대 1주택 비과세 확인 (12억 이하, 2년 이상 보유/거주)
  if (
    propertyType === 'house' &&
    ownedHouses === 1 &&
    holdingYears >= 2 &&
    residenceYears >= 2 &&
    transferPrice <= 1_200_000_000
  ) {
    return {
      transferPrice,
      acquisitionPrice,
      necessaryCosts: acquisitionCost + transferCost,
      transferGain: transferPrice - acquisitionPrice - acquisitionCost - transferCost,
      longTermDeductionRate: 0,
      longTermDeduction: 0,
      basicDeduction: 2_500_000,
      taxBase: 0,
      taxRate: 0,
      capitalGainsTax: 0,
      localIncomeTax: 0,
      totalTax: 0,
      isExempt: true,
      exemptNote: '1세대 1주택 비과세 (12억 이하, 2년 이상 보유/거주)',
    };
  }

  const necessaryCosts = acquisitionCost + transferCost;
  const transferGain = Math.max(0, transferPrice - acquisitionPrice - necessaryCosts);

  // 장기보유특별공제
  const longTermDeductionRate = getLongTermDeductionRate(
    holdingYears,
    residenceYears,
    propertyType,
    ownedHouses
  );
  const longTermDeduction = Math.round(transferGain * (longTermDeductionRate / 100));

  // 기본공제 250만원
  const basicDeduction = 2_500_000;
  const taxBase = Math.max(0, transferGain - longTermDeduction - basicDeduction);

  const taxRate = getTaxRate(taxBase, holdingYears, ownedHouses, isAdjustedArea);

  let capitalGainsTax = 0;
  if (holdingYears < 2) {
    capitalGainsTax = Math.round(taxBase * (taxRate / 100));
  } else if (isAdjustedArea && ownedHouses >= 2) {
    const surcharge = ownedHouses === 2 ? 0.20 : 0.30;
    capitalGainsTax = Math.round(calculateProgressiveTax(taxBase) + taxBase * surcharge);
  } else {
    capitalGainsTax = Math.round(calculateProgressiveTax(taxBase));
  }

  const localIncomeTax = Math.round(capitalGainsTax * 0.1);
  const totalTax = capitalGainsTax + localIncomeTax;

  return {
    transferPrice,
    acquisitionPrice,
    necessaryCosts,
    transferGain,
    longTermDeductionRate,
    longTermDeduction,
    basicDeduction,
    taxBase,
    taxRate,
    capitalGainsTax,
    localIncomeTax,
    totalTax,
    isExempt: false,
  };
}
