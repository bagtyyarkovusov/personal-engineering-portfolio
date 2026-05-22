import { Button } from "@/components/ui/button";
import {
  Status,
  statusConfig,
  allStatuses,
  getStatusConfig,
} from "@/design/statuses";

export const metadata = {
  title: "Design System",
};

function TokenSwatch({
  name,
  bgClass,
  textClass,
  value,
}: {
  name: string;
  bgClass?: string;
  textClass?: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`h-10 w-10 rounded-md border border-border shadow-sm ${bgClass ?? ""}`}
        style={value ? { backgroundColor: value } : undefined}
      />
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{name}</p>
        {value && (
          <p className="font-mono text-xs text-muted-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const config = getStatusConfig(status);
  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badgeClass}`}
      >
        {config.label}
      </span>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{config.labelShort}</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          {config.description}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-border pb-2 text-lg font-medium tracking-tight">
      {children}
    </h2>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-10 p-8">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl tracking-tight">Design System</h1>
        <p className="text-muted-foreground">
          Semantic tokens and status vocabulary for every UI surface.
        </p>
      </header>

      {/* Surface Tokens */}
      <section className="flex flex-col gap-4">
        <SectionHeading>Surface Tokens</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TokenSwatch name="background" bgClass="bg-background" />
          <TokenSwatch name="foreground" bgClass="bg-foreground" />
          <TokenSwatch name="card" bgClass="bg-card" />
          <TokenSwatch name="card-foreground" bgClass="bg-card-foreground" />
          <TokenSwatch name="popover" bgClass="bg-popover" />
          <TokenSwatch
            name="popover-foreground"
            bgClass="bg-popover-foreground"
          />
        </div>
      </section>

      {/* Action Tokens */}
      <section className="flex flex-col gap-4">
        <SectionHeading>Action Tokens</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TokenSwatch name="primary" bgClass="bg-primary" />
          <TokenSwatch
            name="primary-foreground"
            bgClass="bg-primary-foreground"
          />
          <TokenSwatch name="secondary" bgClass="bg-secondary" />
          <TokenSwatch
            name="secondary-foreground"
            bgClass="bg-secondary-foreground"
          />
          <TokenSwatch name="muted" bgClass="bg-muted" />
          <TokenSwatch
            name="muted-foreground"
            bgClass="bg-muted-foreground"
          />
          <TokenSwatch name="accent" bgClass="bg-accent" />
          <TokenSwatch
            name="accent-foreground"
            bgClass="bg-accent-foreground"
          />
          <TokenSwatch name="destructive" bgClass="bg-destructive" />
          <TokenSwatch
            name="destructive-foreground"
            bgClass="bg-destructive-foreground"
          />
        </div>
      </section>

      {/* Structural Tokens */}
      <section className="flex flex-col gap-4">
        <SectionHeading>Structural Tokens</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TokenSwatch name="border" bgClass="bg-border" />
          <TokenSwatch name="input" bgClass="bg-input" />
          <TokenSwatch name="ring" bgClass="bg-ring" />
        </div>
      </section>

      {/* Status Vocabulary */}
      <section className="flex flex-col gap-4">
        <SectionHeading>Status Vocabulary</SectionHeading>
        <p className="text-sm text-muted-foreground">
          State language reused across public pages, admin, private rooms,
          and pipeline evidence.
        </p>
        <div className="flex flex-col gap-4">
          {allStatuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="flex flex-col gap-4">
        <SectionHeading>Typography</SectionHeading>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Instrument Serif</p>
            <p className="font-serif text-3xl tracking-tight">
              Production-minded engineering
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">IBM Plex Sans</p>
            <p className="text-base">
              Built with tests, Dockerized environments, CI/CD, architecture
              decisions, and transparent delivery. The site should feel like an
              engineer with taste, discipline, and operational clarity.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">IBM Plex Mono</p>
            <p className="font-mono text-sm">
              commit 8647d54 — Tailwind v4 configured via globals.css with
              OKLCH tokens
            </p>
          </div>
        </div>
      </section>

      {/* Component Variants */}
      <section className="flex flex-col gap-4">
        <SectionHeading>Button Variants</SectionHeading>
        <p className="text-sm text-muted-foreground">
          shadcn Button component rendered with semantic tokens.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Status in Context */}
      <section className="flex flex-col gap-4">
        <SectionHeading>Status in Context</SectionHeading>
        <p className="text-sm text-muted-foreground">
          How status badges appear on a simulated project card surface.
        </p>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">Portfolio Pipeline</h3>
            <span className="inline-flex items-center rounded-full bg-status-verified px-2.5 py-0.5 text-xs font-medium text-status-verified-foreground">
              Verified
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">CI Quality Gate</span>
              <span className="inline-flex items-center rounded-full bg-status-verified px-2 py-0.5 text-xs font-medium text-status-verified-foreground">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Railway Deployment
              </span>
              <span className="inline-flex items-center rounded-full bg-status-in-progress px-2 py-0.5 text-xs font-medium text-status-in-progress-foreground">
                In Progress
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Post-Deploy Checks
              </span>
              <span className="inline-flex items-center rounded-full bg-status-attention px-2 py-0.5 text-xs font-medium text-status-attention-foreground">
                Attention
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Accessibility Audit
              </span>
              <span className="inline-flex items-center rounded-full bg-status-risk px-2 py-0.5 text-xs font-medium text-status-risk-foreground">
                Risk
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Documentation Draft
              </span>
              <span className="inline-flex items-center rounded-full bg-status-neutral px-2 py-0.5 text-xs font-medium text-status-neutral-foreground">
                Neutral
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          All colors use semantic tokens from{" "}
          <code className="font-mono text-xs">globals.css</code>. No raw OKLCH
          values are hardcoded in components.
        </p>
      </footer>
    </main>
  );
}
