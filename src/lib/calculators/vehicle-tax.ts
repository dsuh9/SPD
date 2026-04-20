export interface VehicleTaxResult {
  annualTax: number;
  localEducationTax: number;
  totalAnnualTax: number;
  ageDiscount: number;
  discountedTax: number;
  earlyPaymentDiscount: number;
  earlyPaymentTotal: number;
  vehicleType: string;
}

function calcBaseTax(displacement: number, isCommercial: boolean): number {
  if (isCommercial) {
    if (displacement <= 1000) return displacement * 18;
    if (displacement <= 1600) return displacement * 18;
    return displacement * 24;
  }
  if (displacement <= 1000) return displacement * 80;
  if (displacement <= 1600) return displacement * 140;
  return displacement * 200;
}

export function calculateVehicleTax(
  displacement: number,
  vehicleAge: number,
  isCommercial: boolean,
  isElectric: boolean
): VehicleTaxResult {
  let annualTax: number;
  let vehicleType: string;

  if (isElectric) {
    annualTax = 130_000;
    vehicleType = "전기차";
  } else {
    annualTax = calcBaseTax(displacement, isCommercial);
    vehicleType = isCommercial ? "영업용" : "비영업용";
  }

  const localEducationTax = Math.round(annualTax * 0.3);
  const totalAnnualTax = annualTax + localEducationTax;

  let discountRate = 0;
  if (vehicleAge >= 3) {
    discountRate = Math.min((vehicleAge - 2) * 0.05, 0.5);
  }
  const ageDiscount = Math.round(totalAnnualTax * discountRate);
  const discountedTax = totalAnnualTax - ageDiscount;

  const earlyPaymentDiscount = Math.round(discountedTax * 0.0458);
  const earlyPaymentTotal = discountedTax - earlyPaymentDiscount;

  return {
    annualTax,
    localEducationTax,
    totalAnnualTax,
    ageDiscount,
    discountedTax,
    earlyPaymentDiscount,
    earlyPaymentTotal,
    vehicleType,
  };
}
