export const VAT_RATE = 0.1; // 10%

export interface VatResult {
  supplyAmount: number;    // 공급가액 (부가세 제외)
  vatAmount: number;       // 부가세액
  totalAmount: number;     // 공급대가 (부가세 포함)
  declarationVat: number;  // 부가세 신고 예상액 (= vatAmount, 매출세액)
}

/** 공급가액으로부터 계산 (부가세 제외 금액 입력) */
export function calculateVatFromSupply(supplyAmount: number): VatResult {
  const vatAmount = Math.round(supplyAmount * VAT_RATE);
  const totalAmount = supplyAmount + vatAmount;
  return {
    supplyAmount: Math.round(supplyAmount),
    vatAmount,
    totalAmount,
    declarationVat: vatAmount,
  };
}

/** 공급대가로부터 계산 (부가세 포함 금액 입력) */
export function calculateVatFromTotal(totalAmount: number): VatResult {
  const supplyAmount = Math.round(totalAmount / (1 + VAT_RATE));
  const vatAmount = totalAmount - supplyAmount;
  return {
    supplyAmount,
    vatAmount,
    totalAmount: Math.round(totalAmount),
    declarationVat: vatAmount,
  };
}
