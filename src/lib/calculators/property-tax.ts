// 2025년 기준 종합부동산세 계산기

export type PropertyTaxType = 'house' | 'land_aggregate' | 'land_separate';

export interface PropertyTaxInput {
  publicPrice: number; // 공시가격 합계 (원)
  propertyType: PropertyTaxType; // 부동산 유형
  ownedHouses: number; // 보유 주택 수
  isAdjustedArea: boolean; // 조정대상지역 주택 보유 여부
  isJointOwnership: boolean; // 공동명의 여부
  age: number; // 나이 (고령자 공제)
  holdingYears: number; // 보유기간 (장기보유 공제)
}

export interface PropertyTaxResult {
  publicPrice: number;
  fairMarketValueRate: number; // 공정시장가액비율 (%)
  taxBase: number; // 과세표준
  deductionAmount: number; // 공제금액
  taxRate: number; // 세율 (%)
  calculatedTax: number; // 종합부동산세
  agricultureTax: number; // 농어촌특별세
  totalTax: number; // 총 세금
  ageDeductionRate: number; // 고령자 공제율 (%)
  holdingDeductionRate: number; // 장기보유 공제율 (%)
  personalDeductionRate: number; // 총 공제율 (%)
  deductedTax: number; // 공제 후 세금
  breakdown: {
    label: string;
    value: string;
  }[];
}

function getHouseDeduction(ownedHouses: number, isAdjustedArea: boolean, isJointOwnership: boolean): number {
  // 1세대 1주택 특별공제
  if (ownedHouses === 1) {
    if (isJointOwnership) {
      return 900_000_000; // 공동명의 1주택: 9억
    }
    return 1_200_000_000; // 단독명의 1세대 1주택: 12억
  }
  // 조정대상지역 2주택 이상 또는 일반 3주택 이상
  return 900_000_000; // 일반: 9억
}

function getHouseTaxRate(taxBase: number, ownedHouses: number, isAdjustedArea: boolean): number {
  const isHeavy = ownedHouses >= 3 || (isAdjustedArea && ownedHouses >= 2);

  if (isHeavy) {
    // 중과세율 (2주택 조정 또는 3주택 이상)
    if (taxBase <= 300_000_000) return 1.2;
    if (taxBase <= 600_000_000) return 1.6;
    if (taxBase <= 1_200_000_000) return 2.2;
    if (taxBase <= 5_000_000_000) return 3.6;
    if (taxBase <= 9_400_000_000) return 5.0;
    return 6.0;
  } else {
    // 일반세율
    if (taxBase <= 300_000_000) return 0.5;
    if (taxBase <= 600_000_000) return 0.7;
    if (taxBase <= 1_200_000_000) return 1.0;
    if (taxBase <= 5_000_000_000) return 1.4;
    if (taxBase <= 9_400_000_000) return 2.0;
    return 2.7;
  }
}

function calculateHouseProgressiveTax(taxBase: number, ownedHouses: number, isAdjustedArea: boolean): number {
  const isHeavy = ownedHouses >= 3 || (isAdjustedArea && ownedHouses >= 2);

  let tax = 0;
  if (isHeavy) {
    if (taxBase <= 300_000_000) {
      tax = taxBase * 0.012;
    } else if (taxBase <= 600_000_000) {
      tax = 3_600_000 + (taxBase - 300_000_000) * 0.016;
    } else if (taxBase <= 1_200_000_000) {
      tax = 8_400_000 + (taxBase - 600_000_000) * 0.022;
    } else if (taxBase <= 5_000_000_000) {
      tax = 21_600_000 + (taxBase - 1_200_000_000) * 0.036;
    } else if (taxBase <= 9_400_000_000) {
      tax = 158_400_000 + (taxBase - 5_000_000_000) * 0.05;
    } else {
      tax = 378_400_000 + (taxBase - 9_400_000_000) * 0.06;
    }
  } else {
    if (taxBase <= 300_000_000) {
      tax = taxBase * 0.005;
    } else if (taxBase <= 600_000_000) {
      tax = 1_500_000 + (taxBase - 300_000_000) * 0.007;
    } else if (taxBase <= 1_200_000_000) {
      tax = 3_600_000 + (taxBase - 600_000_000) * 0.01;
    } else if (taxBase <= 5_000_000_000) {
      tax = 9_600_000 + (taxBase - 1_200_000_000) * 0.014;
    } else if (taxBase <= 9_400_000_000) {
      tax = 62_800_000 + (taxBase - 5_000_000_000) * 0.02;
    } else {
      tax = 150_800_000 + (taxBase - 9_400_000_000) * 0.027;
    }
  }
  return Math.round(tax);
}

export function calculatePropertyTax(input: PropertyTaxInput): PropertyTaxResult {
  const { publicPrice, propertyType, ownedHouses, isAdjustedArea, isJointOwnership, age, holdingYears } = input;

  // 공정시장가액비율 (2025년: 주택 60%)
  const fairMarketValueRate = 60;

  let deductionAmount = 0;
  let calculatedTax = 0;
  let taxRate = 0;

  if (propertyType === 'house') {
    deductionAmount = getHouseDeduction(ownedHouses, isAdjustedArea, isJointOwnership);
    const taxBase = Math.max(0, (publicPrice - deductionAmount) * (fairMarketValueRate / 100));
    taxRate = getHouseTaxRate(taxBase, ownedHouses, isAdjustedArea);
    calculatedTax = calculateHouseProgressiveTax(taxBase, ownedHouses, isAdjustedArea);

    // 고령자 공제 (만 60세 이상)
    let ageDeductionRate = 0;
    if (age >= 60 && age < 65) ageDeductionRate = 20;
    else if (age >= 65 && age < 70) ageDeductionRate = 30;
    else if (age >= 70) ageDeductionRate = 40;

    // 장기보유 공제
    let holdingDeductionRate = 0;
    if (holdingYears >= 5 && holdingYears < 10) holdingDeductionRate = 20;
    else if (holdingYears >= 10 && holdingYears < 15) holdingDeductionRate = 40;
    else if (holdingYears >= 15) holdingDeductionRate = 50;

    // 총 공제율 (최대 80%)
    const totalDeductionRate = Math.min(ageDeductionRate + holdingDeductionRate, 80);
    const deductedTax = Math.round(calculatedTax * (1 - totalDeductionRate / 100));
    const agricultureTax = Math.round(deductedTax * 0.2);
    const totalTax = deductedTax + agricultureTax;

    return {
      publicPrice,
      fairMarketValueRate,
      taxBase,
      deductionAmount,
      taxRate,
      calculatedTax,
      agricultureTax,
      totalTax,
      ageDeductionRate,
      holdingDeductionRate,
      personalDeductionRate: totalDeductionRate,
      deductedTax,
      breakdown: [
        { label: '공시가격', value: `${(publicPrice / 100_000_000).toFixed(2)}억원` },
        { label: '공제금액', value: `${(deductionAmount / 100_000_000).toFixed(1)}억원` },
        { label: '공정시장가액비율', value: `${fairMarketValueRate}%` },
        { label: '과세표준', value: `${(taxBase / 100_000_000).toFixed(2)}억원` },
        { label: '세율', value: `${taxRate}%` },
        { label: '고령자공제', value: `${ageDeductionRate}%` },
        { label: '장기보유공제', value: `${holdingDeductionRate}%` },
        { label: '총 공제율', value: `${totalDeductionRate}%` },
      ],
    };
  } else {
    // 토지 (간소화)
    deductionAmount = propertyType === 'land_aggregate' ? 500_000_000 : 1_600_000_000;
    const taxBase = Math.max(0, (publicPrice - deductionAmount) * (fairMarketValueRate / 100));

    if (propertyType === 'land_aggregate') {
      if (taxBase <= 200_000_000) taxRate = 1.0;
      else if (taxBase <= 1_000_000_000) taxRate = 2.0;
      else taxRate = 3.0;
    } else {
      if (taxBase <= 1_500_000_000) taxRate = 0.5;
      else if (taxBase <= 4_500_000_000) taxRate = 0.6;
      else taxRate = 0.7;
    }

    calculatedTax = Math.round(taxBase * (taxRate / 100));
    const agricultureTax = Math.round(calculatedTax * 0.2);
    const totalTax = calculatedTax + agricultureTax;

    return {
      publicPrice,
      fairMarketValueRate,
      taxBase,
      deductionAmount,
      taxRate,
      calculatedTax,
      agricultureTax,
      totalTax,
      ageDeductionRate: 0,
      holdingDeductionRate: 0,
      personalDeductionRate: 0,
      deductedTax: calculatedTax,
      breakdown: [
        { label: '공시가격', value: `${(publicPrice / 100_000_000).toFixed(2)}억원` },
        { label: '공제금액', value: `${(deductionAmount / 100_000_000).toFixed(1)}억원` },
        { label: '공정시장가액비율', value: `${fairMarketValueRate}%` },
        { label: '과세표준', value: `${(taxBase / 100_000_000).toFixed(2)}억원` },
        { label: '세율', value: `${taxRate}%` },
      ],
    };
  }
}
