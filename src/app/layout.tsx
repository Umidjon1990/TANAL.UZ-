import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zamonaviy Ta'lim Tanal Loyihasi",
  description: "O'zbekistondagi TANAL arab tili sertifikat imtihon sanalari"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz-Latn">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
