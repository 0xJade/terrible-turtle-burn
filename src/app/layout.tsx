import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import LenisProvider from "@/components/lenis-provider";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Terrible Turtle Camp — Move Slow & Bite Things",
  description:
    "An AI and art-centered Burning Man camp where technology meets radical creative expression.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${rajdhani.variable} font-[family-name:var(--font-rajdhani)] antialiased`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
