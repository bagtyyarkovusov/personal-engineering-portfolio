import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getPublishedPublicProjects } from "@/features/projects/queries";
import { projectMedia } from "@/features/projects/media";
import { getLatestPublicBuildLogEntry } from "@/features/build-logs/queries";
import { formatPostDate, getPublishedPosts } from "@/content/blog/loader";

import type { Metadata } from "next";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const sectionLabel = "font-mono text-xs text-muted-foreground";

export default async function HomePage() {
  const [projects, latestBuildLogEntry] = await Promise.all([
    getPublishedPublicProjects(),
    getLatestPublicBuildLogEntry(),
  ]);
  const flagshipProject = projects[0] ?? null;
  const flagshipMedia = flagshipProject
    ? projectMedia[flagshipProject.slug]
    : undefined;
  const latestPosts = getPublishedPosts().slice(0, 3);

  return (
    <main className="px-6 pb-8 pt-10 sm:px-10 lg:px-16 lg:pt-16">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }])} />

      <div className="mx-auto max-w-5xl space-y-20 lg:space-y-24">
        {/* Intro: two lines, then straight into the work */}
        <section className="max-w-xl space-y-4">
          <Image
            src="/bagtyyar-avatar.jpg"
            alt="Bagtyyar Kowusow"
            width={480}
            height={480}
            preload
            sizes="80px"
            className="size-20 rounded-full border border-border object-cover"
          />
          <h1
            data-testid="homepage-trust-claim"
            className="text-2xl text-foreground sm:text-3xl"
          >
            Bagtyyar, full-stack engineer.
          </h1>
          <p className="text-muted-foreground">
            I build mobile apps, web apps and the backends behind them. Latest:
            Carberk, a car marketplace live on Google Play.
          </p>
          {latestBuildLogEntry && (
            <Link
              href="/build-log"
              data-testid="homepage-now-signal"
              className="inline-block font-mono text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              Last shipped{" "}
              {new Date(latestBuildLogEntry.occurredAt).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "short", day: "numeric" },
              )}{" "}
              · {latestBuildLogEntry.project.title} · build log →
            </Link>
          )}
        </section>

        {/* Flagship: media first */}
        {flagshipProject && (
          <section
            data-testid="flagship-project"
            aria-labelledby="flagship-title"
            className="space-y-6"
          >
            <p className={sectionLabel}>Featured</p>
            {flagshipMedia && (
              <Link
                href={`/work/${flagshipProject.slug}`}
                className="grid grid-cols-3 gap-3 sm:gap-5"
                tabIndex={-1}
                aria-hidden="true"
              >
                {flagshipMedia.shots.map((shot, index) => (
                  <Image
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    preload={index === 0}
                    sizes="(min-width: 1024px) 330px, 30vw"
                    className="h-auto w-full rounded-xl border border-border transition-opacity duration-300 hover:opacity-90"
                  />
                ))}
              </Link>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl space-y-1">
                <h2 id="flagship-title" className="text-lg text-foreground">
                  {flagshipProject.title}
                </h2>
                <p className="text-muted-foreground">{flagshipProject.summary}</p>
              </div>
              <div className="flex shrink-0 gap-5">
                <Link
                  href={`/work/${flagshipProject.slug}`}
                  className="inline-flex min-h-11 items-center text-foreground transition-colors hover:text-muted-foreground"
                >
                  Case study
                </Link>
                {(flagshipMedia?.storeUrl ?? flagshipProject.liveUrl) && (
                  <a
                    href={flagshipMedia?.storeUrl ?? flagshipProject.liveUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {flagshipMedia?.storeUrl ? "Google Play" : "Live site"}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Selected work: numbered index */}
        {projects.length > 0 && (
          <section aria-labelledby="work-title" className="space-y-4">
            <h2 id="work-title" className={sectionLabel}>
              Selected work
            </h2>
            <ol className="divide-y divide-border border-y border-border">
              {projects.map((project, index) => (
                <li key={project.id}>
                  <Link
                    href={`/work/${project.slug}`}
                    className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="font-mono text-xs text-muted-foreground sm:w-8">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground transition-colors group-hover:text-muted-foreground sm:flex-1">
                      {project.title}
                    </span>
                    <span className="text-muted-foreground sm:text-right">
                      {project.stack.slice(0, 3).join(", ").toLowerCase()}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link
              href="/work"
              className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              All work and case studies
            </Link>
          </section>
        )}

        {/* Latest writing */}
        {latestPosts.length > 0 && (
          <section aria-labelledby="writing-title" className="space-y-4">
            <h2 id="writing-title" className={sectionLabel}>
              Writing
            </h2>
            <ul className="divide-y divide-border border-y border-border">
              {latestPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="text-foreground transition-colors group-hover:text-muted-foreground sm:flex-1">
                      {post.title}
                    </span>
                    <time
                      dateTime={post.date}
                      className="font-mono text-xs text-muted-foreground"
                    >
                      {formatPostDate(post.date)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
