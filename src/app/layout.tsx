import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "한국 세금 계산기 - 연봉, 부동산, 종합소득세",
    template: "%s | 한국 세금 계산기",
  },
  description:
    "연봉 실수령액, 취득세, 양도소득세, 종합소득세, 종합부동산세를 쉽고 빠르게 계산하세요. 2025-2026년 최신 세법 적용.",
  keywords: [
    "연봉 실수령액 계산기",
    "취득세 계산기",
    "양도소득세 계산기",
    "종합소득세 계산기",
    "종합부동산세 계산기",
    "세금 계산기",
    "4대보험 계산기",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "한국 세금 계산기",
    title: "한국 세금 계산기 - 연봉, 부동산, 종합소득세",
    description:
      "연봉 실수령액, 취득세, 양도소득세, 종합소득세, 종합부동산세를 쉽고 빠르게 계산하세요.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
