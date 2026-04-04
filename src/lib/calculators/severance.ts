export interface SeveranceInput {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  monthlyWage: number; // 퇴직 전 3개월 평균 월 임금 (원)
  annualBonus?: number; // 연간 상여금 합계 (원)
  annualLeaveAllowance?: number; // 연차수당 합계 (원)
}

export interface SeveranceResult {
  workingDays: number;       // 총 재직일수
  workingYears: number;      // 근속연수 (소수점)
  averageDailyWage: number;  // 1일 평균임금
  severancePay: number;      // 퇴직금
  isEligible: boolean;       // 퇴직금 수급 자격 (1년 이상)
  monthsWorked: number;      // 근무 개월수
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function calculateSeverance(input: SeveranceInput): SeveranceResult {
  const workingDays = daysBetween(input.startDate, input.endDate);
  const workingYears = workingDays / 365;
  const monthsWorked = workingDays / 30;
  const isEligible = workingDays >= 365;

  // 퇴직 전 3개월 임금 총액 (3개월 = 91일로 계산)
  // 평균임금 = (3개월 임금 + 상여금 일할 + 연차수당 일할) / 3개월 일수(91일)
  const threeMonthWage = input.monthlyWage * 3;
  const bonusPerPeriod = ((input.annualBonus ?? 0) * 3) / 12;
  const leavePerPeriod = ((input.annualLeaveAllowance ?? 0) * 3) / 12;
  const totalWageInPeriod = threeMonthWage + bonusPerPeriod + leavePerPeriod;
  const PERIOD_DAYS = 91; // 3개월 평균 일수

  const averageDailyWage = totalWageInPeriod / PERIOD_DAYS;

  // 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365)
  const severancePay = isEligible
    ? Math.floor(averageDailyWage * 30 * workingYears)
    : 0;

  return {
    workingDays,
    workingYears: Math.round(workingYears * 100) / 100,
    averageDailyWage: Math.floor(averageDailyWage),
    severancePay,
    isEligible,
    monthsWorked: Math.floor(monthsWorked),
  };
}
