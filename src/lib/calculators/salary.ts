// 2025년 기준 연봉 실수령액 계산기

export interface SalaryInput {
  annualSalary: number; // 연봉 (원)
  dependents: number; // 부양가족 수 (본인 포함)
  nonTaxableIncome: number; // 비과세 소득 (원/월)
}

export interface SalaryResult {
  annualSalary: number;
  monthlyGross: number; // 월 세전 급여
  nationalPension: number; // 국민연금 (월)
  healthInsurance: number; // 건강보험 (월)
  longTermCare: number; // 장기요양보험 (월)
  employmentInsurance: number; // 고용보험 (월)
  incomeTax: number; // 소득세 (월)
  localIncomeTax: number; // 지방소득세 (월)
  totalDeduction: number; // 총 공제액 (월)
  monthlyNet: number; // 월 실수령액
  annualNet: number; // 연 실수령액
  effectiveTaxRate: number; // 실효세율 (%)
}

// 2025년 근로소득세 간이세액표 (월 급여 기준)
// 부양가족 수에 따른 세액 계산
function calculateIncomeTax(monthlyTaxableIncome: number, dependents: number): number {
  // 간이세액표 기반 계산 (2025년 기준)
  // 월 과세표준에 따른 세율 적용
  const annual = monthlyTaxableIncome * 12;

  // 근로소득공제
  let deduction = 0;
  if (annual <= 5_000_000) {
    deduction = annual * 0.7;
  } else if (annual <= 15_000_000) {
    deduction = 3_500_000 + (annual - 5_000_000) * 0.4;
  } else if (annual <= 45_000_000) {
    deduction = 7_500_000 + (annual - 15_000_000) * 0.15;
  } else if (annual <= 100_000_000) {
    deduction = 12_000_000 + (annual - 45_000_000) * 0.05;
  } else {
    deduction = 14_750_000 + (annual - 100_000_000) * 0.02;
  }
  deduction = Math.min(deduction, 20_000_000); // 최대 2천만원

  // 근로소득금액
  const earnedIncome = annual - deduction;

  // 인적공제 (150만원 × 부양가족 수)
  const personalDeduction = 1_500_000 * dependents;

  // 과세표준
  const taxBase = Math.max(0, earnedIncome - personalDeduction);

  // 소득세율 구간 (2025년 기준)
  let annualTax = 0;
  if (taxBase <= 14_000_000) {
    annualTax = taxBase * 0.06;
  } else if (taxBase <= 50_000_000) {
    annualTax = 840_000 + (taxBase - 14_000_000) * 0.15;
  } else if (taxBase <= 88_000_000) {
    annualTax = 6_240_000 + (taxBase - 50_000_000) * 0.24;
  } else if (taxBase <= 150_000_000) {
    annualTax = 15_360_000 + (taxBase - 88_000_000) * 0.35;
  } else if (taxBase <= 300_000_000) {
    annualTax = 37_060_000 + (taxBase - 150_000_000) * 0.38;
  } else if (taxBase <= 500_000_000) {
    annualTax = 94_060_000 + (taxBase - 300_000_000) * 0.40;
  } else if (taxBase <= 1_000_000_000) {
    annualTax = 174_060_000 + (taxBase - 500_000_000) * 0.42;
  } else {
    annualTax = 384_060_000 + (taxBase - 1_000_000_000) * 0.45;
  }

  // 근로소득세액공제
  let taxCredit = 0;
  if (annualTax <= 1_300_000) {
    taxCredit = annualTax * 0.55;
  } else {
    taxCredit = 715_000 + (annualTax - 1_300_000) * 0.30;
  }
  taxCredit = Math.min(taxCredit, 740_000); // 최대 74만원 (총급여 3300만원 이하)
  if (annual > 33_000_000 && annual <= 70_000_000) {
    taxCredit = Math.min(taxCredit, 660_000);
  } else if (annual > 70_000_000) {
    taxCredit = Math.min(taxCredit, 500_000);
  }

  const finalAnnualTax = Math.max(0, annualTax - taxCredit);
  return Math.round(finalAnnualTax / 12);
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const { annualSalary, dependents, nonTaxableIncome } = input;
  const monthlyGross = Math.round(annualSalary / 12);

  // 4대보험 계산 (2025년 기준)
  // 국민연금: 4.5% (월 상한: 617,700원 - 기준소득월액 상한 5,908,333원 기준)
  const pensionBase = Math.min(monthlyGross, 5_908_333);
  const nationalPension = Math.round(pensionBase * 0.045);

  // 건강보험: 3.545%
  const healthInsurance = Math.round(monthlyGross * 0.03545);

  // 장기요양보험: 건강보험료 × 12.95%
  const longTermCare = Math.round(healthInsurance * 0.1295);

  // 고용보험: 0.9%
  const employmentInsurance = Math.round(monthlyGross * 0.009);

  // 소득세 계산 (비과세 제외)
  const monthlyTaxable = monthlyGross - nonTaxableIncome;
  const incomeTax = calculateIncomeTax(Math.max(0, monthlyTaxable), Math.max(1, dependents));

  // 지방소득세: 소득세 × 10%
  const localIncomeTax = Math.round(incomeTax * 0.1);

  const totalDeduction = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;
  const monthlyNet = monthlyGross - totalDeduction;
  const annualNet = monthlyNet * 12;
  const effectiveTaxRate = ((totalDeduction * 12) / annualSalary) * 100;

  return {
    annualSalary,
    monthlyGross,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    totalDeduction,
    monthlyNet,
    annualNet,
    effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
  };
}
