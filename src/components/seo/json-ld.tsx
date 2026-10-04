export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bagtyyar.dev";

// Single source of truth for the public identity. Canonical name uses the
// Turkmen spelling; ASCII spellings live in alternateName.
export const IDENTITY = {
  name: "Bagtyýar Kowusow",
  alternateName: ["Bagtyyar Kowusow", "Bagtyyar"],
  url: SITE_URL,
  sameAs: [
    "https://github.com/bagtyyarkovusov",
    "https://www.linkedin.com/in/bagty%C3%BDar-kowusow-70b12a273/",
  ],
} as const;

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bagtyyar",
    url: SITE_URL,
    description:
      "Production-minded full-stack and mobile software engineering by Bagtyyar. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    inLanguage: "en",
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: IDENTITY.name,
    alternateName: [...IDENTITY.alternateName],
    url: IDENTITY.url,
    sameAs: [...IDENTITY.sameAs],
    description:
      "Production-minded full-stack and mobile software engineer.",
    knowsAbout: [
      "Full-stack Software Engineering",
      "Mobile Development",
      "CI/CD",
      "Docker",
      "Architecture Decision Records",
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "Prisma",
    ],
  };
}

export function projectSchema(project: {
  title: string;
  summary: string | null;
  slug: string;
  updatedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/work/${project.slug}`,
    dateModified: project.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: IDENTITY.name,
      url: IDENTITY.url,
    },
  };
}

export function breadcrumbListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
