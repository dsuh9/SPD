// 2025년 기준 부동산 취득세 계산기

export type PropertyType = 'house' | 'land' | 'commercial';
export type AcquisitionPurpose = 'residence' | 'investment';

export interface AcquisitionTaxInput {
  acquisitionPrice: number; // 취득가액 (원)
  propertyType: PropertyType; // 부동산 유형
  purpose: AcquisitionPurpose; // 취득 목적
  ownedHouses: number; // 현재 보유 주택 수 (취득 전)
  isAdjustedArea: boolean; // 조정대상지역 여부
}

export interface AcquisitionTaxResult {
  acquisitionPrice: number;
  taxRate: number; // 취득세율 (%)
  acquisitionTax: number; // 취득세
  ruralTax: number; // 농어촌특별세
  educationTax: number; // 지방교육세
  totalTax: number; // 총 세금
  effectiveRate: number; // 실효세율 (%)
  breakdown: {
    label: string;
    amount: number;
    rate: string;
  }[];
}

export function calculateAcquisitionTax(input: AcquisitionTaxInput): AcquisitionTaxResult {
  const { acquisitionPrice, propertyType, purpose, ownedHouses, isAdjustedArea } = input;

  let taxRate = 0;
  let ruralTaxRate = 0;
  let educationTaxRate = 0;

  if (propertyType === 'house') {
    // 주택 취득세 (2025년 기준)
    const totalHouses = ownedHouses + 1; // 취득 후 보유 주택 수

    if (purpose === 'residence') {
      // 1주택 실거주
      if (acquisitionPrice <= 600_000_000) {
        taxRate = 1.0; // 6억 이하: 1%
      } else if (acquisitionPrice <= 900_000_000) {
        // 6억~9억: 누진 적용
        taxRate = ((acquisitionPrice / 100_000_000) * 2 / 3 - 3) / 10;
        taxRate = Math.min(Math.max(taxRate, 1), 3);
      } else {
        taxRate = 3.0; // 9억 초과: 3%
      }
    }

    // 다주택자 중과세 (조정대상지역)
    if (isAdjustedArea && totalHouses >= 2) {
      if (totalHouses === 2) {
        taxRate = 8.0; // 2주택: 8%
      } else if (totalHouses === 3) {
        taxRate = 12.0; // 3주택: 12%
      } else {
        taxRate = 12.0; // 4주택 이상: 12%
      }
    } else if (!isAdjustedArea && totalHouses >= 3) {
      if (totalHouses === 3) {
        taxRate = 8.0;
      } else {
        taxRate = 12.0;
      }
    }

    // 농어촌특별세: 취득세율이 1% 이상인 경우 취득세의 10%
    // (전용 85㎡ 초과 주택)
    ruralTaxRate = taxRate >= 1 ? taxRate * 0.1 : 0;

    // 지방교육세
    if (taxRate <= 2) {
      educationTaxRate = 0.2; // 취득세율 2% 이하: 취득세의 20%
    } else {
      educationTaxRate = taxRate >= 8 ? 0 : 0.2; // 중과세율 적용 시 별도
    }

    // 중과세 시 농어촌특별세/지방교육세 재계산
    if (taxRate >= 8) {
      ruralTaxRate = 0.6; // 8% × 농어촌특별세
      educationTaxRate = 0.4; // 별도 계산
    }

  } else if (propertyType === 'land') {
    // 토지 취득세
    taxRate = 3.0;
    ruralTaxRate = 0.2; // 농어촌특별세
    educationTaxRate = 0.2; // 취득세의 20%
  } else if (propertyType === 'commercial') {
    // 상업용 부동산
    taxRate = 4.0;
    ruralTaxRate = 0.2;
    educationTaxRate = 0.2;
  }

  const acquisitionTax = Math.round(acquisitionPrice * (taxRate / 100));
  const ruralTax = Math.round(acquisitionPrice * (ruralTaxRate / 100));
  const educationTax = Math.round(acquisitionTax * (educationTaxRate));
  const totalTax = acquisitionTax + ruralTax + educationTax;
  const effectiveRate = (totalTax / acquisitionPrice) * 100;

  const breakdown = [
    {
      label: '취득세',
      amount: acquisitionTax,
      rate: `${taxRate.toFixed(1)}%`,
    },
    {
      label: '농어촌특별세',
      amount: ruralTax,
      rate: `${(ruralTaxRate).toFixed(2)}%`,
    },
    {
      label: '지방교육세',
      amount: educationTax,
      rate: `취득세의 ${(educationTaxRate * 100).toFixed(0)}%`,
    },
  ];

  return {
    acquisitionPrice,
    taxRate,
    acquisitionTax,
    ruralTax,
    educationTax,
    totalTax,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    breakdown,
  };
}
