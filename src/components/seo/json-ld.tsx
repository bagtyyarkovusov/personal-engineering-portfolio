export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bagtyyar",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://bagtyyar.dev",
    description:
      "Production-minded full-stack and mobile software engineering by Bagtyyar. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    inLanguage: "en",
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bagtyyar",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://bagtyyar.dev",
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bagtyyar.dev";
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${baseUrl}/work/${project.slug}`,
    dateModified: project.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Bagtyyar",
      url: baseUrl,
    },
  };
}

export function breadcrumbListSchema(items: { name: string; url: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bagtyyar.dev";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}
