import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import InquiryButton from "./components/InquiryButton";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "One thing, 오늘 집중해야 할 한 가지",
  description: "오늘 집중해야 할 한 가지를 찾을 수 있도록 도와주는 AI 상담사",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="prose mx-auto max-w-screen-md h-full flex flex-col">
          <header className="flex justify-between items-center border-b bg-white p-4 sticky top-0">
              <h2 className="m-0 text-base sm:text-2xl">지금 내가 집중해야 할 단 한 가지</h2>
              <InquiryButton />
          </header>
          <main className="flex-grow px-4 flex flex-col font-[family-name:var(--font-geist-sans)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
