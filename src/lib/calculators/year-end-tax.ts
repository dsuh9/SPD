export interface YearEndTaxInput {
  totalSalary: number;
  familyCount: number;
  childCount: number;
  creditCardAmount: number;
  medicalExpense: number;
  educationExpense: number;
  insurancePremium: number;
  donationAmount: number;
  paidTax: number;
}

export interface YearEndTaxResult {
  totalSalary: number;
  earnedIncomeDeduction: number;
  earnedIncome: number;
  personalDeduction: number;
  creditCardDeduction: number;
  taxableIncome: number;
  calculatedTax: number;
  earnedIncomeTaxCredit: number;
  childTaxCredit: number;
  insuranceCredit: number;
  medicalCredit: number;
  educationCredit: number;
  donationCredit: number;
  totalTaxCredit: number;
  determinedTax: number;
  paidTax: number;
  refundOrPayment: number;
}

const INCOME_TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduction: 0 },
  { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
];

function calcEarnedIncomeDeduction(salary: number): number {
  if (salary <= 5_000_000) return Math.min(salary, salary * 0.7);
  if (salary <= 15_000_000) return 3_500_000 + (salary - 5_000_000) * 0.4;
  if (salary <= 45_000_000) return 7_500_000 + (salary - 15_000_000) * 0.15;
  if (salary <= 100_000_000) return 12_000_000 + (salary - 45_000_000) * 0.05;
  return Math.min(14_750_000 + (salary - 100_000_000) * 0.02, 20_000_000);
}

function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.limit)!;
  return Math.round(taxableIncome * bracket.rate - bracket.deduction);
}

function calcEarnedIncomeTaxCredit(calculatedTax: number, totalSalary: number): number {
  let credit: number;
  if (totalSalary <= 33_000_000) {
    credit = Math.min(calculatedTax * 0.55, 740_000);
  } else if (totalSalary <= 70_000_000) {
    credit = Math.min(calculatedTax * 0.55, 660_000);
  } else {
    credit = Math.min(calculatedTax * 0.55, 500_000);
  }
  return Math.round(credit);
}

export function calculateYearEndTax(input: YearEndTaxInput): YearEndTaxResult {
  const earnedIncomeDeduction = Math.round(calcEarnedIncomeDeduction(input.totalSalary));
  const earnedIncome = input.totalSalary - earnedIncomeDeduction;

  const personalDeduction = 1_500_000 * input.familyCount;

  const creditCardThreshold = input.totalSalary * 0.25;
  const creditCardExcess = Math.max(input.creditCardAmount - creditCardThreshold, 0);
  const creditCardDeduction = Math.min(Math.round(creditCardExcess * 0.15), 3_000_000);

  const taxableIncome = Math.max(earnedIncome - personalDeduction - creditCardDeduction, 0);
  const calculatedTax = calcIncomeTax(taxableIncome);

  const earnedIncomeTaxCredit = calcEarnedIncomeTaxCredit(calculatedTax, input.totalSalary);

  const childTaxCredit = input.childCount > 0
    ? (input.childCount <= 1 ? 150_000 : input.childCount === 2 ? 350_000 : 350_000 + (input.childCount - 2) * 300_000)
    : 0;

  const insuranceCredit = Math.round(Math.min(input.insurancePremium, 1_000_000) * 0.12);

  const medicalThreshold = input.totalSalary * 0.03;
  const medicalExcess = Math.max(input.medicalExpense - medicalThreshold, 0);
  const medicalCredit = Math.round(Math.min(medicalExcess, 7_000_000) * 0.15);

  const educationCredit = Math.round(Math.min(input.educationExpense, 9_000_000) * 0.15);

  const donationCredit =
    input.donationAmount <= 10_000_000
      ? Math.round(input.donationAmount * 0.15)
      : Math.round(10_000_000 * 0.15 + (input.donationAmount - 10_000_000) * 0.3);

  const totalTaxCredit =
    earnedIncomeTaxCredit + childTaxCredit + insuranceCredit + medicalCredit + educationCredit + donationCredit;

  const determinedTax = Math.max(calculatedTax - totalTaxCredit, 0);
  const refundOrPayment = input.paidTax - determinedTax;

  return {
    totalSalary: input.totalSalary,
    earnedIncomeDeduction,
    earnedIncome,
    personalDeduction,
    creditCardDeduction,
    taxableIncome,
    calculatedTax,
    earnedIncomeTaxCredit,
    childTaxCredit,
    insuranceCredit,
    medicalCredit,
    educationCredit,
    donationCredit,
    totalTaxCredit,
    determinedTax,
    paidTax: input.paidTax,
    refundOrPayment,
  };
}
