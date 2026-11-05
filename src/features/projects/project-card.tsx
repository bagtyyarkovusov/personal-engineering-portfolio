import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Layers3 } from "lucide-react";
import { PublicProject } from "./queries";
import { getProjectCardShot } from "./media";
import { getProjectLifecycle, getProjectLifecycleClasses } from "./presentation";

export function ProjectCard({ project }: { project: PublicProject }) {
  const cardShot = getProjectCardShot(project.slug);
  const lifecycle = getProjectLifecycle(project.slug);
  const LifecycleIcon = lifecycle.icon;
  const lifecycleClasses = getProjectLifecycleClasses(lifecycle.tone);

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:border-primary/20 hover:bg-accent/40 hover:shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-background">
        {cardShot ? (
          <Image
            src={cardShot.src}
            alt={cardShot.alt}
            width={cardShot.width}
            height={cardShot.height}
            sizes="(min-width: 768px) 704px, calc(100vw - 4rem)"
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <LifecycleIcon aria-hidden="true" className="size-12 stroke-[1.25] text-muted-foreground" />
          </div>
        )}
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-md bg-foreground text-background shadow-sm"
        >
          <LifecycleIcon className="size-4" strokeWidth={1.8} />
        </span>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="font-serif text-2xl tracking-tight text-card-foreground">
              <Link
                href={`/work/${project.slug}`}
                className="transition-colors hover:text-muted-foreground"
              >
                {project.title}
              </Link>
            </h2>
            <span
              title={lifecycle.detail}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${lifecycleClasses.badge}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {lifecycle.shortLabel}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{project.summary}</p>
        </header>

        {project.stack.length > 0 && (
          <div className="flex items-start gap-2">
            <Layers3 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <ul className="flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((tech) => (
                <li
                  key={tech}
                  className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors duration-200 group-hover:border-primary/15"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-primary transition-colors hover:text-foreground"
          >
            Case study
            <ArrowRight className="size-4" />
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {project.liveUrl.includes("play.google.com") ? "Google Play" : "Live site"}
              <ArrowUpRight className="size-4" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
              <ArrowUpRight className="size-4" />
            </a>
          )}
        </div>

        <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {project.startedAt && (
            <span>
              Started{" "}
              {new Date(project.startedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </span>
          )}
          {project.completedAt && (
            <span>
              Completed{" "}
              {new Date(project.completedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </span>
          )}
        </footer>
      </div>
    </article>
  );
}
