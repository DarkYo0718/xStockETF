import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "xStockETF",
  description: "主動式 ETF 研究工作台 MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        <div className="shell">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
