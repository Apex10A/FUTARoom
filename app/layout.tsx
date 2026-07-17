import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { ConditionalSiteShell } from "@/components/layout/conditional-site-shell";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants/site";

import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <ConditionalSiteShell>{children}</ConditionalSiteShell>
      </body>
    </html>
  );
}
