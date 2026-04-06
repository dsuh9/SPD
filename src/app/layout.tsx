import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://divine-rejoicing-production.up.railway.app";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "한국 계산기 모음 - 연봉, 세금, 부동산 계산기",
    template: "%s | 한국 계산기 모음",
  },
  description:
    "연봉 실수령액, 취득세, 양도소득세, 종합소득세, 종합부동산세를 쉽고 빠르게 계산하세요. 2026년 최신 세법 적용. 회원가입 없이 무료 사용.",
  keywords: [
    "연봉 실수령액 계산기",
    "취득세 계산기",
    "양도소득세 계산기",
    "종합소득세 계산기",
    "종합부동산세 계산기",
    "세금 계산기",
    "4대보험 계산기",
    "한국 계산기",
  ],
  alternates: {
    canonical: BASE_URL,
    languages: { "ko-KR": BASE_URL },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "한국 계산기 모음",
    title: "한국 계산기 모음 - 연봉, 세금, 부동산 계산기",
    description:
      "연봉 실수령액, 취득세, 양도소득세, 종합소득세, 종합부동산세를 쉽고 빠르게 계산하세요. 2026년 최신 세법 적용.",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "한국 계산기 모음 - 연봉, 세금, 부동산 계산기",
    description: "연봉 실수령액, 취득세, 양도소득세 등을 무료로 계산하세요.",
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
      <head>
        <link rel="alternate" hrefLang="ko-KR" href={BASE_URL} />
        <link rel="alternate" hrefLang="x-default" href={BASE_URL} />
      </head>
      <body className="antialiased">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <Header />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
