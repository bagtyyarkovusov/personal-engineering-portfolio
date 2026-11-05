export type ProjectSitemapEntry = { slug: string; updatedAt: Date };

/**
 * The public catalog must still be discoverable during a build or runtime
 * window where Postgres is asleep. Keep this list aligned with the public
 * project order in the seed; admin-only projects never belong here.
 */
export const PUBLIC_PROJECT_FALLBACK_SLUGS = [
  "car-marketplace",
  "tayyn-hyzmat",
  "myorl-ent-clinic",
  "personal-engineering-portfolio",
] as const;

export function getFallbackProjectSitemapEntries(
  lastModified: Date,
): ProjectSitemapEntry[] {
  return PUBLIC_PROJECT_FALLBACK_SLUGS.map((slug) => ({
    slug,
    updatedAt: lastModified,
  }));
}
