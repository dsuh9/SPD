import Link from "next/link";
import { Calculator, Home, TrendingUp, FileText, Building, Banknote, CreditCard, Receipt, Gift, ArrowLeftRight, CalendarCheck, Car, HeartPulse } from "lucide-react";

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
  {
    href: "/severance",
    icon: Banknote,
    title: "퇴직금 계산기",
    description: "입사일·퇴사일·월평균임금 기반으로 법정 퇴직금을 계산합니다. 상여금, 연차수당 포함.",
    keywords: "퇴직금, 근속연수, 평균임금, 법정퇴직금",
    color: "teal",
  },
  {
    href: "/loan",
    icon: CreditCard,
    title: "대출이자 계산기",
    description: "원리금균등·원금균등·만기일시 상환 방식별 이자 및 월 상환액을 계산합니다.",
    keywords: "대출이자, 원리금균등, 원금균등, 주택담보대출",
    color: "indigo",
  },
  {
    href: "/vat",
    icon: Receipt,
    title: "부가세(VAT) 계산기",
    description: "공급가액 ↔ 부가세 포함가 변환, 부가세 신고 예상 매출세액을 계산합니다.",
    keywords: "부가세, VAT, 공급가액, 부가가치세 신고",
    color: "violet",
  },
  {
    href: "/inheritance-gift-tax",
    icon: Gift,
    title: "상속세·증여세 계산기",
    description: "상속·증여 재산에 대한 세액을 계산합니다. 세대생략 할증, 신고공제 반영.",
    keywords: "상속세, 증여세, 증여공제, 세대생략 할증",
    color: "emerald",
  },
  {
    href: "/jeonse-wolse",
    icon: ArrowLeftRight,
    title: "전월세 전환 계산기",
    description: "전세 ↔ 월세 상호 전환. 법정 전환율(2.5%) 기준 적정 월세를 계산합니다.",
    keywords: "전월세 전환, 전세 월세, 법정 전환율, 보증금",
    color: "sky",
  },
  {
    href: "/year-end-tax",
    icon: CalendarCheck,
    title: "연말정산 계산기",
    description: "소득·세액공제를 반영한 연말정산 예상 환급액 또는 추가 납부액을 계산합니다.",
    keywords: "연말정산, 소득공제, 세액공제, 환급액, 13월의 월급",
    color: "amber",
  },
  {
    href: "/vehicle-tax",
    icon: Car,
    title: "자동차세 계산기",
    description: "배기량·전기차별 자동차세, 차령 경감, 연납 할인을 계산합니다.",
    keywords: "자동차세, 배기량, 전기차 세금, 연납 할인",
    color: "rose",
  },
  {
    href: "/health-insurance",
    icon: HeartPulse,
    title: "건강보험료 계산기",
    description: "직장·지역 가입자 건강보험료와 장기요양보험료를 계산합니다.",
    keywords: "건강보험료, 장기요양보험, 직장가입자, 지역가입자",
    color: "cyan",
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
  teal: {
    bg: "bg-teal-50",
    icon: "text-teal-600",
    hover: "hover:border-teal-300 hover:bg-teal-50/50",
  },
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    hover: "hover:border-indigo-300 hover:bg-indigo-50/50",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    hover: "hover:border-violet-300 hover:bg-violet-50/50",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    hover: "hover:border-emerald-300 hover:bg-emerald-50/50",
  },
  sky: {
    bg: "bg-sky-50",
    icon: "text-sky-600",
    hover: "hover:border-sky-300 hover:bg-sky-50/50",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    hover: "hover:border-amber-300 hover:bg-amber-50/50",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "text-rose-600",
    hover: "hover:border-rose-300 hover:bg-rose-50/50",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    hover: "hover:border-cyan-300 hover:bg-cyan-50/50",
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
          연봉, 부동산, 상속·증여, 연말정산, 전월세 등 다양한 세금을 쉽고 빠르게 계산하세요
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
