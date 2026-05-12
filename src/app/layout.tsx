import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd, websiteSchema, personSchema } from "@/components/seo/json-ld";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Bagtyyar",
    default: "Bagtyyar — Production-Minded Engineer",
  },
  description:
    "Production-minded full-stack and mobile software engineering by Bagtyyar. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Bagtyyar",
    title: "Bagtyyar — Production-Minded Engineer",
    description:
      "Production-minded full-stack and mobile software engineering by Bagtyyar. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    images: [
      {
        url: "/og?title=Bagtyyar&description=Production-minded%20full-stack%20and%20mobile%20software%20engineering",
        width: 1200,
        height: 630,
        alt: "Bagtyyar — Production-Minded Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bagtyyar — Production-Minded Engineer",
    description:
      "Production-minded full-stack and mobile software engineering by Bagtyyar. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    images: ["/og?title=Bagtyyar&description=Production-minded%20full-stack%20and%20mobile%20software%20engineering"],
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
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        {children}
        <JsonLd data={websiteSchema()} />
        <JsonLd data={personSchema()} />
      </body>
    </html>
  );
}
