import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  type LucideIcon,
  User,
  FolderKanban,
  ShieldCheck,
  Wrench,
  Briefcase,
  GraduationCap,
  Mail,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import { JsonLd, breadcrumbListSchema, IDENTITY } from "@/components/seo/json-ld";
import { PrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Bagtyýar Kowusow — full-stack and mobile software engineer. Selected projects, engineering system, experience, and education.",
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Resume | Bagtyýar Kowusow",
    description:
      "Full-stack and mobile software engineer. Selected projects, engineering system, experience, and education.",
    images: [
      {
        url: "/og?title=Resume%20%7C%20Bagty%C3%BDar%20Kowusow&description=Full-stack%20and%20mobile%20software%20engineer",
        width: 1200,
        height: 630,
        alt: "Resume | Bagtyýar Kowusow",
      },
    ],
  },
  twitter: {
    title: "Resume | Bagtyýar Kowusow",
    description:
      "Full-stack and mobile software engineer. Selected projects, engineering system, experience, and education.",
    images: [
      "/og?title=Resume%20%7C%20Bagty%C3%BDar%20Kowusow&description=Full-stack%20and%20mobile%20software%20engineer",
    ],
  },
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bagtyyar.dev";

function resumePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: IDENTITY.name,
    alternateName: [...IDENTITY.alternateName],
    url: IDENTITY.url,
    sameAs: [...IDENTITY.sameAs],
    email: "mailto:bagtyyarkovusov@icloud.com",
    jobTitle: "Full-Stack & Mobile Software Engineer",
    knowsAbout: [
      "Full-stack Software Engineering",
      "Mobile Development",
      "TypeScript",
      "Next.js",
      "NestJS",
      "React Native",
      "PostgreSQL",
      "Prisma",
      "Docker",
      "CI/CD",
      "GPU Inference Infrastructure",
    ],
  };
}

const projects = [
  {
    title: "AutoTM — Turkmenistan's Vehicle Marketplace",
    href: "/work/car-marketplace",
    description:
      "Ground-up rewrite of Turkmenistan's vehicle marketplace. Turborepo monorepo with an Expo / React Native app, a NestJS 11 API organized into bounded contexts, Prisma with explicit migrations, phone-OTP authentication, and a trilingual catalog — designed for air-gapped Docker deployment inside Turkmenistan with no cloud dependency on the production path.",
  },
  {
    title: "Personal Engineering Portfolio",
    href: "/work/personal-engineering-portfolio",
    description:
      "This site — a Next.js 16 portfolio built as a working demonstration of its own engineering system: 141 Vitest unit tests, Playwright e2e and accessibility scans, GitHub Actions quality gates, Dockerized Railway deployment with startup Prisma migrations, and token-gated private client rooms for transparent delivery.",
  },
  {
    title: "Gonka — AI Inference Infrastructure",
    href: "/work/gonka-ai-inference-infrastructure",
    description:
      "Specified, deployed, and supported a 24-server / 192× RTX 4080 GPU inference cluster serving open-weight LLMs on the Gonka decentralized AI network. Also built and open-sourced GonkaProvider, a public OpenAI-compatible API gateway on top of the cluster.",
  },
  {
    title: "MyORL — ENT Clinic Platform",
    href: "/work/myorl-ent-clinic",
    description:
      "Bilingual (Greek/Russian) platform for a private ENT surgical clinic in Athens — Next.js 16 frontend, Strapi 5 CMS with full content handover to clinic staff, and Meilisearch patient-facing search. Live in production and serving real patients.",
  },
  {
    title: "TM-WhatsApp",
    href: "https://github.com/bagtyyarkovusov/tm-whatsapp",
    description:
      "A messenger alternative for Turkmenistan — fast, clean, and made for the local community. In development.",
  },
];

const systemHighlights = [
  "Tests and CI as standard: type checking, unit tests, Playwright e2e, accessibility scans, and production builds run as gates on every project.",
  "Docker and migration discipline: containerized environments from development to production, with database schema evolution through explicit, version-controlled migrations.",
  "Documented decisions: architecture decision records, build logs, and milestone tracking on every serious project — delivery is transparent by default.",
  "AI-assisted workflow under engineering discipline: AI tooling is part of every pull request, but every change passes the same review, type-check, and CI gates as hand-written code.",
];

const skillGroups = [
  {
    label: "Languages",
    items: "TypeScript, JavaScript, SQL",
  },
  {
    label: "Web",
    items: "Next.js (App Router), React, Node.js, NestJS, Tailwind CSS",
  },
  {
    label: "Mobile",
    items: "React Native, Expo",
  },
  {
    label: "Data",
    items: "PostgreSQL, Prisma, Redis, Meilisearch",
  },
  {
    label: "Infrastructure",
    items: "Docker, GitHub Actions, Railway, Linux servers, GPU inference clusters",
  },
  {
    label: "Practices",
    items:
      "Automated testing (Vitest, Playwright), CI/CD, architecture decision records, accessibility (WCAG)",
  },
];

const experience = [
  {
    role: "Software Development Intern",
    company: "Timar",
    location: "Turkmenistan",
    period: "Sep 2022 – Jun 2023",
    note: "Part-time (3 days/week) alongside studies.",
    description: "UI tasks and small development jobs.",
  },
  {
    role: "Web Development Intern",
    company: "Yolashan",
    location: "Turkmenistan",
    period: "Sep 2022 – Jun 2023",
    note: "Part-time (3 days/week) alongside studies.",
    description: "Maintained the company website and small web tasks.",
  },
];

const education = [
  {
    school: "Zhejiang University of Technology",
    location: "China",
    degree: "B.Sc. Computer Software Engineering",
    period: "Sep 2024 – Jul 2028 (expected)",
    note: "Fully funded 5-year CSC scholarship.",
  },
  {
    school: "UIBE Business School",
    location: "China",
    degree: "CSC Pre-course, Software Engineering",
    period: "Sep 2023 – Jun 2024",
    note: null,
  },
  {
    school: "International University for the Humanities and Development",
    location: "Turkmenistan",
    degree: "Software Engineering",
    period: "Sep 2022 – Jun 2023",
    note: "Transferred to the ZJUT scholarship.",
  },
];

const contactLinks: { label: string; href: string; icon: LucideIcon }[] = [
  {
    label: "bagtyyarkovusov@icloud.com",
    href: "mailto:bagtyyarkovusov@icloud.com",
    icon: Mail,
  },
  { label: "bagtyyar.dev", href: BASE_URL, icon: Globe },
  {
    label: "linkedin.com/in/bagtyýar-kowusow-70b12a273",
    href: "https://www.linkedin.com/in/bagty%C3%BDar-kowusow-70b12a273/",
    icon: LinkIcon,
  },
  {
    label: "github.com/bagtyyarkovusov",
    href: "https://github.com/bagtyyarkovusov",
    icon: LinkIcon,
  },
];

function SectionHeading({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-12 px-6 py-16 print:gap-8 print:py-0 lg:px-8 lg:py-24">
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "Resume", url: "/resume" },
        ])}
      />
      <JsonLd data={resumePersonSchema()} />

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
              Bagtyýar Kowusow
            </h1>
            <p className="text-lg text-muted-foreground">
              Full-Stack &amp; Mobile Software Engineer
            </p>
            <p className="text-sm text-muted-foreground">
              Currently based in China — open to remote work.
            </p>
          </div>
          <PrintButton />
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {contactLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex items-center gap-1.5 text-primary underline-offset-4 transition-colors hover:underline"
              >
                <link.icon className="size-4 shrink-0" aria-hidden="true" />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      {/* Summary */}
      <section className="space-y-3">
        <SectionHeading icon={User}>Summary</SectionHeading>
        <p className="leading-relaxed text-foreground">
          Full-stack engineer building production web and mobile systems with
          Next.js, TypeScript, NestJS, and React Native. I ship with tests,
          Docker, CI/CD, and explicit database migrations — and the evidence is
          public: a bilingual healthcare platform serving patients in Athens, a
          24-server / 192-GPU AI inference deployment, and a portfolio codebase
          with 141 automated tests. Currently completing a fully funded
          software engineering degree at Zhejiang University of Technology.
        </p>
      </section>

      {/* Selected Projects */}
      <section className="space-y-5">
        <SectionHeading icon={FolderKanban}>Selected Projects</SectionHeading>
        <ul className="space-y-5">
          {projects.map((project) => (
            <li key={project.title} className="space-y-1">
              <h3 className="font-medium text-foreground">
                {project.href.startsWith("http") ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {project.title}
                  </a>
                ) : (
                  <Link
                    href={project.href}
                    className="underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {project.title}
                  </Link>
                )}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Engineering System Highlights */}
      <section className="space-y-4">
        <SectionHeading icon={ShieldCheck}>Engineering System Highlights</SectionHeading>
        <ul className="space-y-2">
          {systemHighlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-sm leading-relaxed text-foreground">
                {highlight}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Key Skills */}
      <section className="space-y-4">
        <SectionHeading icon={Wrench}>Key Skills</SectionHeading>
        <dl className="space-y-2">
          {skillGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="w-32 shrink-0 text-sm font-medium text-foreground">
                {group.label}
              </dt>
              <dd className="text-sm text-muted-foreground">{group.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Experience */}
      <section className="space-y-5">
        <SectionHeading icon={Briefcase}>Experience</SectionHeading>
        <ul className="space-y-5">
          {experience.map((job) => (
            <li key={job.company} className="space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-medium text-foreground">
                  {job.company} — {job.role}
                </h3>
                <p className="text-sm text-muted-foreground">{job.period}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {job.location} · {job.note}
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {job.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Education */}
      <section className="space-y-5">
        <SectionHeading icon={GraduationCap}>Education</SectionHeading>
        <ul className="space-y-5">
          {education.map((entry) => (
            <li key={entry.school} className="space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-medium text-foreground">
                  {entry.school} ({entry.location})
                </h3>
                <p className="text-sm text-muted-foreground">{entry.period}</p>
              </div>
              <p className="text-sm text-foreground">{entry.degree}</p>
              {entry.note && (
                <p className="text-sm text-muted-foreground">{entry.note}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="space-y-4 border-t border-border pt-8">
        <SectionHeading icon={Mail}>Contact</SectionHeading>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {contactLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex items-center gap-1.5 text-primary underline-offset-4 transition-colors hover:underline"
              >
                <link.icon className="size-4 shrink-0" aria-hidden="true" />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Languages: Turkmen, English, Russian (also studying Chinese).
        </p>
      </section>
    </main>
  );
}
