import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

export function parseKoreanNumber(value: string): number {
  // Remove all non-numeric characters except dots
  const cleaned = value.replace(/[^\d.]/g, "");
  return parseFloat(cleaned) || 0;
}

export function toEokwan(amount: number): string {
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);

  if (eok > 0 && man > 0) {
    return `${eok}억 ${formatNumber(man)}만원`;
  } else if (eok > 0) {
    return `${eok}억원`;
  } else if (man > 0) {
    return `${formatNumber(man)}만원`;
  }
  return `${formatNumber(amount)}원`;
}
