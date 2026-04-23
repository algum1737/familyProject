import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "오늘 다 했니?",
  description: "원형 24시간 계획판 기반 TO DO 웹 MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

