import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { getSiteConfig } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const site = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.companyName} | ${site.tagline}`,
    template: `%s | ${site.companyName}`,
  },
  description: site.description,
  openGraph: {
    title: site.companyName,
    description: site.description,
    url: site.url,
    siteName: site.companyName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.companyName,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
