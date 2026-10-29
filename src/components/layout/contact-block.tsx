import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SocialLinks } from "@/components/layout/social-links";
import { HumanSignal } from "@/components/layout/human-signal";

const EMAIL = "bagtyyarkovusov@icloud.com";

const channels = [
  { href: "https://cal.com/bagtyyar-kovusov", label: "Book a 20-minute call" },
  {
    href: "https://www.upwork.com/freelancers/~015b99076f8e93af2c",
    label: "Hire me on Upwork",
  },
];

const moreLinks = [
  { href: "/work", label: "Portfolio" },
  { href: "/resume", label: "Resume" },
  { href: "/engineering-system", label: "Engineering system" },
  { href: "/build-log", label: "Build log" },
  { href: "/work-with-me", label: "Engagement options" },
];

/* The one contact surface, rendered at the foot of every public page. */
export function ContactBlock() {
  return (
    <footer
      id="contact"
      className="scroll-mt-20 border-t border-border px-6 py-16 print:hidden sm:px-10 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-3">
          <h2 className="text-xl text-foreground">
            Let&rsquo;s work together.
          </h2>
          <a
            href={`mailto:${EMAIL}?subject=Project%20inquiry`}
            className="inline-block break-all text-2xl text-muted-foreground underline-offset-8 transition-colors hover:text-foreground hover:underline sm:text-3xl"
          >
            {EMAIL}
          </a>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <div className="space-y-4">
            <p className="max-w-sm text-muted-foreground">
              Web and mobile apps, backends and APIs, built remotely for clients
              in any time zone.
            </p>
            <ul className="space-y-1">
              {channels.map((channel) => (
                <li key={channel.href}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {channel.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="More" className="sm:justify-self-end">
            <ul className="space-y-1 sm:text-right">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="grid gap-8 border-t border-border pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-5">
            <HumanSignal />
            <p className="font-mono text-xs text-muted-foreground">
              © {new Date().getFullYear()} Bagtyyar Kowusow
            </p>
          </div>
          <SocialLinks className="-mr-3" />
        </div>
      </div>
    </footer>
  );
}
