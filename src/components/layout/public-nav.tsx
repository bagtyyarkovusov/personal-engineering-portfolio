"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { SocialLinks } from "@/components/layout/social-links";
import {
  CURRENT_AVAILABILITY,
  availabilityConfig,
} from "@/components/ui/availability-badge";

/*
  Four destinations (ADR-0007). Each owns the older routes that now live
  under it, so the active state follows the visitor into sub-pages.
*/
const navLinks = [
  { href: "/work", label: "Work", owns: ["/work"] },
  { href: "/blog", label: "Writing", owns: ["/blog", "/build-log"] },
  {
    href: "/about",
    label: "About",
    owns: ["/about", "/resume", "/engineering-system"],
  },
  { href: "#contact", label: "Contact", owns: ["/work-with-me"] },
];

function isActive(pathname: string, owns: string[]) {
  return owns.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {navLinks.map((link) => {
        const active = isActive(pathname, link.owns);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active && !link.href.startsWith("#") ? "page" : undefined}
              className={`flex min-h-11 items-center text-[15px] transition-colors duration-200 lg:min-h-9 ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="group flex flex-col">
      <span className="text-[15px] font-medium text-foreground">Bagtyyar</span>
      <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
        full-stack engineer
      </span>
    </Link>
  );
}

function Availability() {
  const { label, dot } = availabilityConfig[CURRENT_AVAILABILITY];
  return (
    <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </p>
  );
}

export function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop: fixed left rail */}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col justify-between px-8 py-10 print:hidden lg:flex">
        <div className="space-y-10">
          <Brand />
          <nav aria-label="Main">
            <NavList pathname={pathname} />
          </nav>
        </div>
        <div className="space-y-4">
          <Availability />
          <SocialLinks className="-ml-3" />
        </div>
      </div>

      {/* Mobile: slim top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur print:hidden lg:hidden">
        <div className="flex h-14 items-center justify-between px-5">
          <Brand onNavigate={() => setMobileOpen(false)} />
          <button
            ref={menuButtonRef}
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {mobileOpen && (
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="border-t border-border px-5 pb-5 pt-2"
          >
            <NavList
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
            <div className="mt-4">
              <Availability />
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
