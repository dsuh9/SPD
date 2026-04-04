export type RepaymentType = "equal_payment" | "equal_principal" | "bullet";

export interface LoanInput {
  principal: number;      // 대출원금 (원)
  annualRate: number;     // 연이율 (%, 예: 3.5)
  termMonths: number;     // 대출기간 (개월)
  repaymentType: RepaymentType;
}

export interface MonthlyDetail {
  month: number;
  payment: number;        // 납입액
  principal: number;      // 원금
  interest: number;       // 이자
  balance: number;        // 잔금
}

export interface LoanResult {
  monthlyPayment: number;    // 월 납입액 (원리금균등/만기일시: 매월 동일, 원금균등: 첫달)
  totalPayment: number;      // 총 상환금액
  totalInterest: number;     // 총 이자
  schedule: MonthlyDetail[]; // 상환 스케줄 (최대 360개월)
}

export function calculateLoan(input: LoanInput): LoanResult {
  const { principal, annualRate, termMonths, repaymentType } = input;
  const monthlyRate = annualRate / 100 / 12;

  if (repaymentType === "equal_payment") {
    // 원리금균등상환
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = principal / termMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = Math.round((principal * monthlyRate * factor) / (factor - 1));
    }

    let balance = principal;
    let totalInterest = 0;
    const schedule: MonthlyDetail[] = [];

    for (let m = 1; m <= termMonths; m++) {
      const interest = Math.round(balance * monthlyRate);
      const principalPart = m === termMonths
        ? balance
        : Math.round(monthlyPayment - interest);
      const actualPayment = principalPart + interest;
      balance -= principalPart;
      totalInterest += interest;
      schedule.push({ month: m, payment: actualPayment, principal: principalPart, interest, balance: Math.max(0, balance) });
    }

    return {
      monthlyPayment,
      totalPayment: principal + totalInterest,
      totalInterest,
      schedule,
    };
  }

  if (repaymentType === "equal_principal") {
    // 원금균등상환
    const principalPerMonth = Math.round(principal / termMonths);
    let balance = principal;
    let totalInterest = 0;
    const schedule: MonthlyDetail[] = [];

    for (let m = 1; m <= termMonths; m++) {
      const interest = Math.round(balance * monthlyRate);
      const actualPrincipal = m === termMonths ? balance : principalPerMonth;
      const payment = actualPrincipal + interest;
      balance -= actualPrincipal;
      totalInterest += interest;
      schedule.push({ month: m, payment, principal: actualPrincipal, interest, balance: Math.max(0, balance) });
    }

    return {
      monthlyPayment: schedule[0].payment,
      totalPayment: principal + totalInterest,
      totalInterest,
      schedule,
    };
  }

  // 만기일시상환 (bullet)
  const monthlyInterest = Math.round(principal * monthlyRate);
  let totalInterest = 0;
  const schedule: MonthlyDetail[] = [];

  for (let m = 1; m <= termMonths; m++) {
    const isLast = m === termMonths;
    const payment = isLast ? principal + monthlyInterest : monthlyInterest;
    const principalPart = isLast ? principal : 0;
    totalInterest += monthlyInterest;
    schedule.push({
      month: m,
      payment,
      principal: principalPart,
      interest: monthlyInterest,
      balance: isLast ? 0 : principal,
    });
  }

  return {
    monthlyPayment: monthlyInterest,
    totalPayment: principal + totalInterest,
    totalInterest,
    schedule,
  };
}
