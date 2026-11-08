import { headers } from "next/headers";
import { resolveLanguage } from "@/data/resume";
import { ThemeProvider } from "@/components/resume/theme-provider";
import type { Metadata, Viewport } from "next";
import { site, demoMode } from "@/data/resume/site";
import "./globals.css";

const siteUrl = site.url.replace(/\/$/, "");

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.title} – Resume Template & CV Component for Next.js`,
    template: `%s | ${site.title}`,
  },
  description:
    "Open-source bilingual resume template and copyable React document built with Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui.",
  applicationName: site.title,
  category: "technology",
  keywords: [
    "Resume Template",
    "CV Template",
    "Next.js Resume",
    "React CV Component",
    "shadcn/ui Resume",
    "Tailwind CSS v4 CV",
    "Frontend Architecture",
    "Bilingual Resume React",
    "Accessible Resume",
    "A4 PDF Export Resume",
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: !demoMode && process.env.VERCEL_ENV !== "preview",
    follow: true,
    googleBot: {
      index: !demoMode && process.env.VERCEL_ENV !== "preview",
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: site.title,
    title: "ShadCN CV Kit – Resume Template & CV Component for Next.js",
    description:
      "A modern, bilingual, accessible resume template and portable React document crafted with Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadCN CV Kit – Resume Template & CV Component for Next.js",
    description:
      "A modern, bilingual, accessible resume template and portable React document crafted with Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui.",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "llms-txt": `${siteUrl}/llms.txt`,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const language = resolveLanguage((await headers()).get("x-resume-language"));
  return (
    <html className="scroll-smooth" lang={language} suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM Documentation"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
