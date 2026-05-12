import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bagtyyar.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch the most recently updated published public project
  const latestProject = await prisma.project.findFirst({
    where: buildVisibilityFilter("public"),
    orderBy: { updatedAt: "desc" },
    select: { updatedAt: true },
  });

  // Fetch the most recently published build log entry
  const latestBuildLog = await prisma.buildLogEntry.findFirst({
    where: buildVisibilityFilter("public"),
    orderBy: { updatedAt: "desc" },
    select: { updatedAt: true },
  });

  // Compute the most recent content modification date as a fallback
  const mostRecentDate =
    latestBuildLog?.updatedAt ?? latestProject?.updatedAt ?? new Date();

  // Public static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: mostRecentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: latestProject?.updatedAt ?? mostRecentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: mostRecentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/engineering-system`,
      lastModified: mostRecentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/build-log`,
      lastModified: latestBuildLog?.updatedAt ?? mostRecentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/work-with-me`,
      lastModified: mostRecentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic project pages — only published + public-visible projects
  const projects = await prisma.project.findMany({
    where: buildVisibilityFilter("public"),
    select: { slug: true, updatedAt: true },
  });

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
