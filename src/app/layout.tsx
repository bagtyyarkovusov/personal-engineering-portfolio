import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd, websiteSchema, personSchema } from "@/components/seo/json-ld";

const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteTitle = "Bagtyyar Kowusow · Full-stack engineer, web and mobile";
const siteDescription =
  "Full-stack engineer building web and mobile products. Latest: Carberk, a car marketplace live on Google Play.";
const ogImage =
  "/og?title=Bagtyyar%20Kowusow&description=Full-stack%20engineer%2C%20web%20and%20mobile";

export const metadata: Metadata = {
  title: {
    template: "%s | Bagtyyar",
    default: siteTitle,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Bagtyyar",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: ogImage, width: 1200, height: 630, alt: siteTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bagtyyar.dev"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <JsonLd data={websiteSchema()} />
        <JsonLd data={personSchema()} />
        {umamiScriptUrl && umamiWebsiteId ? (
          <Script
            src={umamiScriptUrl}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
            defer
          />
        ) : null}
      </body>
    </html>
  );
}
