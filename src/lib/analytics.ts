declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackCalculatorUse(calculatorName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "calculator_use", {
      event_category: "Calculator",
      event_label: calculatorName,
      ...params,
    });
  }
}
