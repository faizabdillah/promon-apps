import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mikrotik.Box - Deploy with a single click",
  description: "Production ready software for Mikrotik management in seconds.",
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-gray-900 text-white`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
