import Link from "next/link";
import { PublicProject } from "./queries";

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block rounded-lg border border-border bg-card p-6 transition-all duration-300 ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:border-primary/20 hover:bg-accent/40 hover:shadow-sm">
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl tracking-tight text-card-foreground">
            {project.title}
          </h2>
          <p className="text-sm text-muted-foreground">{project.summary}</p>
        </header>

        {project.stack.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors duration-200 group-hover:border-primary/15"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {project.outcome && (
          <p className="text-sm font-medium text-card-foreground">
            {project.outcome}
          </p>
        )}

        <footer className="flex items-center gap-3 text-xs text-muted-foreground">
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
          {!project.completedAt && (
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-in-progress opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-status-in-progress" />
              </span>
              <span className="text-status-in-progress font-medium">Active build</span>
            </span>
          )}
        </footer>
      </div>
    </Link>
  );
}
