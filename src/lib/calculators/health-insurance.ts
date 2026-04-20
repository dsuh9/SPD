export interface HealthInsuranceResult {
  type: "employee" | "selfEmployed";
  monthlySalary: number;
  healthInsurance: number;
  longTermCare: number;
  totalMonthly: number;
  totalYearly: number;
}

const HEALTH_INSURANCE_RATE = 0.0709;
const EMPLOYEE_SHARE = 0.5;
const LONG_TERM_CARE_RATE = 0.1295;

const SELF_EMPLOYED_HEALTH_RATE = 0.0709;
const SELF_EMPLOYED_LONG_TERM_CARE_RATE = 0.1295;

export function calculateEmployeeHealthInsurance(
  monthlySalary: number
): HealthInsuranceResult {
  const fullHealth = Math.round(monthlySalary * HEALTH_INSURANCE_RATE);
  const healthInsurance = Math.round(fullHealth * EMPLOYEE_SHARE);
  const longTermCare = Math.round(healthInsurance * LONG_TERM_CARE_RATE);
  const totalMonthly = healthInsurance + longTermCare;

  return {
    type: "employee",
    monthlySalary,
    healthInsurance,
    longTermCare,
    totalMonthly,
    totalYearly: totalMonthly * 12,
  };
}

export function calculateSelfEmployedHealthInsurance(
  monthlyIncome: number
): HealthInsuranceResult {
  const healthInsurance = Math.round(monthlyIncome * SELF_EMPLOYED_HEALTH_RATE);
  const longTermCare = Math.round(healthInsurance * SELF_EMPLOYED_LONG_TERM_CARE_RATE);
  const totalMonthly = healthInsurance + longTermCare;

  return {
    type: "selfEmployed",
    monthlySalary: monthlyIncome,
    healthInsurance,
    longTermCare,
    totalMonthly,
    totalYearly: totalMonthly * 12,
  };
}
