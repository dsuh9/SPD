// 2025년 기준 종합소득세 계산기

export interface IncomeTaxInput {
  businessIncome: number; // 사업소득 (원/연)
  earnedIncome: number; // 근로소득 (원/연)
  interestIncome: number; // 이자소득 (원/연)
  dividendIncome: number; // 배당소득 (원/연)
  rentalIncome: number; // 임대소득 (원/연)
  otherIncome: number; // 기타소득 (원/연)
  // 공제 항목
  personalDeductions: number; // 인적공제 추가 (원) - 기본공제 150만×N 별도
  dependents: number; // 부양가족 수 (본인 포함)
  insurancePremium: number; // 보험료 공제 (원)
  medicalExpenses: number; // 의료비 공제 (원)
  educationExpenses: number; // 교육비 공제 (원)
  donationAmount: number; // 기부금 공제 (원)
  nationalPensionPaid: number; // 납부한 국민연금 (원)
}

export interface IncomeTaxResult {
  totalIncome: number; // 총수입금액
  totalExpenseDeduction: number; // 필요경비/소득공제
  totalDeductedIncome: number; // 공제 후 소득금액
  totalPersonalDeduction: number; // 인적공제
  specialDeduction: number; // 특별공제
  standardDeduction: number; // 표준공제
  nationalPensionDeduction: number; // 국민연금 공제
  taxBase: number; // 과세표준
  taxRate: number; // 최고 세율 (%)
  calculatedTax: number; // 산출세액
  taxCredit: number; // 세액공제
  finalTax: number; // 결정세액
  localIncomeTax: number; // 지방소득세
  totalTax: number; // 총 세금
  effectiveTaxRate: number; // 실효세율 (%)
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
  return Math.round(tax);
}

function getTopTaxRate(taxBase: number): number {
  if (taxBase <= 14_000_000) return 6;
  if (taxBase <= 50_000_000) return 15;
  if (taxBase <= 88_000_000) return 24;
  if (taxBase <= 150_000_000) return 35;
  if (taxBase <= 300_000_000) return 38;
  if (taxBase <= 500_000_000) return 40;
  if (taxBase <= 1_000_000_000) return 42;
  return 45;
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const {
    businessIncome,
    earnedIncome,
    interestIncome,
    dividendIncome,
    rentalIncome,
    otherIncome,
    dependents,
    insurancePremium,
    medicalExpenses,
    educationExpenses,
    donationAmount,
    nationalPensionPaid,
  } = input;

  // 총 수입금액
  const totalIncome = businessIncome + earnedIncome + interestIncome + dividendIncome + rentalIncome + otherIncome;

  // 근로소득공제
  let earnedIncomeDeduction = 0;
  if (earnedIncome <= 5_000_000) {
    earnedIncomeDeduction = earnedIncome * 0.7;
  } else if (earnedIncome <= 15_000_000) {
    earnedIncomeDeduction = 3_500_000 + (earnedIncome - 5_000_000) * 0.4;
  } else if (earnedIncome <= 45_000_000) {
    earnedIncomeDeduction = 7_500_000 + (earnedIncome - 15_000_000) * 0.15;
  } else if (earnedIncome <= 100_000_000) {
    earnedIncomeDeduction = 12_000_000 + (earnedIncome - 45_000_000) * 0.05;
  } else {
    earnedIncomeDeduction = 14_750_000 + (earnedIncome - 100_000_000) * 0.02;
  }
  earnedIncomeDeduction = Math.min(earnedIncomeDeduction, 20_000_000);

  // 기타소득 필요경비 (60%)
  const otherIncomeDeduction = otherIncome * 0.6;
  // 사업소득 필요경비 (단순 추정, 실제는 복잡)
  const businessIncomeDeduction = businessIncome * 0.3;

  const totalExpenseDeduction = earnedIncomeDeduction + otherIncomeDeduction + businessIncomeDeduction;

  // 공제 후 소득금액
  const totalDeductedIncome = Math.max(0, totalIncome - totalExpenseDeduction);

  // 인적공제 (1인당 150만원)
  const totalPersonalDeduction = 1_500_000 * Math.max(1, dependents);

  // 국민연금 납부액 소득공제
  const nationalPensionDeduction = nationalPensionPaid;

  // 특별공제 (보험료, 의료비, 교육비, 기부금)
  const specialDeduction = insurancePremium + medicalExpenses + educationExpenses + donationAmount;
  // 표준공제 (특별공제가 130만원 미만인 경우 130만원 적용)
  const standardDeduction = Math.max(specialDeduction, 1_300_000);
  const appliedSpecialDeduction = standardDeduction;

  // 과세표준
  const taxBase = Math.max(0, totalDeductedIncome - totalPersonalDeduction - nationalPensionDeduction - appliedSpecialDeduction);
  const taxRate = getTopTaxRate(taxBase);
  const calculatedTax = calculateProgressiveTax(taxBase);

  // 세액공제 (근로소득세액공제)
  let taxCredit = 0;
  if (earnedIncome > 0) {
    if (calculatedTax <= 1_300_000) {
      taxCredit = Math.round(calculatedTax * 0.55);
    } else {
      taxCredit = Math.round(715_000 + (calculatedTax - 1_300_000) * 0.3);
    }
    if (earnedIncome <= 33_000_000) {
      taxCredit = Math.min(taxCredit, 740_000);
    } else if (earnedIncome <= 70_000_000) {
      taxCredit = Math.min(taxCredit, 660_000);
    } else {
      taxCredit = Math.min(taxCredit, 500_000);
    }
  }

  const finalTax = Math.max(0, calculatedTax - taxCredit);
  const localIncomeTax = Math.round(finalTax * 0.1);
  const totalTax = finalTax + localIncomeTax;
  const effectiveTaxRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenseDeduction: Math.round(totalExpenseDeduction),
    totalDeductedIncome: Math.round(totalDeductedIncome),
    totalPersonalDeduction,
    specialDeduction: appliedSpecialDeduction,
    standardDeduction: 1_300_000,
    nationalPensionDeduction,
    taxBase,
    taxRate,
    calculatedTax,
    taxCredit,
    finalTax,
    localIncomeTax,
    totalTax,
    effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
  };
}
