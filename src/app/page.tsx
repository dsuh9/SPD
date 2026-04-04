import Link from "next/link";
import { Calculator, Home, TrendingUp, FileText, Building } from "lucide-react";

const calculators = [
  {
    href: "/salary",
    icon: Calculator,
    title: "연봉 실수령액 계산기",
    description: "연봉에서 4대보험과 소득세를 공제한 실수령액을 계산합니다.",
    keywords: "4대보험, 국민연금, 건강보험, 고용보험, 소득세",
    color: "blue",
  },
  {
    href: "/realestate/acquisition",
    icon: Home,
    title: "취득세 계산기",
    description: "부동산 취득 시 납부해야 하는 취득세, 농어촌특별세, 지방교육세를 계산합니다.",
    keywords: "부동산 취득세, 주택 취득세, 농어촌특별세",
    color: "green",
  },
  {
    href: "/realestate/capital-gains",
    icon: TrendingUp,
    title: "양도소득세 계산기",
    description: "부동산 양도 시 발생하는 양도소득세를 계산합니다. 1세대1주택 비과세 자동 판단.",
    keywords: "양도소득세, 부동산 세금, 장기보유특별공제",
    color: "orange",
  },
  {
    href: "/income-tax",
    icon: FileText,
    title: "종합소득세 계산기",
    description: "근로소득, 사업소득 등 종합소득에 대한 종합소득세를 계산합니다.",
    keywords: "종합소득세, 사업소득, 프리랜서 세금",
    color: "purple",
  },
  {
    href: "/property-tax",
    icon: Building,
    title: "종합부동산세 계산기",
    description: "일정 기준 이상의 부동산 보유자에게 부과되는 종합부동산세를 계산합니다.",
    keywords: "종합부동산세, 종부세, 부동산 보유세",
    color: "red",
  },
];

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    hover: "hover:border-blue-300 hover:bg-blue-50/50",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    hover: "hover:border-green-300 hover:bg-green-50/50",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    hover: "hover:border-orange-300 hover:bg-orange-50/50",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    hover: "hover:border-purple-300 hover:bg-purple-50/50",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    hover: "hover:border-red-300 hover:bg-red-50/50",
  },
};

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          한국 세금 계산기
        </h1>
        <p className="text-gray-500 text-lg">
          연봉, 부동산 세금을 쉽고 빠르게 계산하세요
        </p>
        <p className="text-sm text-gray-400 mt-2">2025-2026년 최신 세법 기준</p>
      </div>

      {/* 계산기 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calculators.map((calc) => {
          const colors = colorMap[calc.color as keyof typeof colorMap];
          const Icon = calc.icon;
          return (
            <Link
              key={calc.href}
              href={calc.href}
              className={`block bg-white rounded-xl border border-gray-200 p-5 transition-all ${colors.hover} group`}
            >
              <div className="flex items-start gap-4">
                <div className={`${colors.bg} p-3 rounded-lg flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-gray-700">
                    {calc.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {calc.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{calc.keywords}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 안내 문구 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-700 text-center">
          모든 계산기는 <strong>2025-2026년 세법</strong>을 기준으로 합니다.
          회원가입 없이 바로 사용 가능합니다.
        </p>
      </div>
    </div>
  );
}
