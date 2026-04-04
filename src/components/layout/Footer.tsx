export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">
            본 계산기는 2025~2026년 세법을 기준으로 한 참고용 계산기입니다.
          </p>
          <p className="mb-2">
            실제 세금은 개인 상황에 따라 다를 수 있으며, 정확한 세금은 세무사 또는 국세청 상담을 통해 확인하세요.
          </p>
          <p className="text-xs text-gray-400 mt-4">
            © 2025 세금계산기 | 본 서비스는 세금 신고 대행 서비스가 아닙니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
