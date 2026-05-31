import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "harness-mini — a minimal, CLI-agnostic agent harness",
    template: "%s · harness-mini",
  },
  description:
    "A minimal, CLI-agnostic agent harness: convention + skills + sub-agents + distilled best-practice docs, with only thin shell glue as code. The harness is the environment, not a program.",
  keywords: [
    "agent harness",
    "LLM agents",
    "Claude Code",
    "Codex",
    "long-running agents",
    "context engineering",
    "harness-mini",
  ],
  authors: [{ name: "harness-mini" }],
  openGraph: {
    title: "harness-mini — a minimal, CLI-agnostic agent harness",
    description:
      "Convention + skills + sub-agents + distilled best-practice docs, with only thin shell glue as code.",
    url: SITE_URL,
    siteName: "harness-mini",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "harness-mini",
    description:
      "A minimal, CLI-agnostic agent harness. The harness is the environment, not a program.",
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
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
