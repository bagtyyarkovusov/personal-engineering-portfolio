import Link from "next/link";
import { ContactBlock } from "@/components/layout/contact-block";
import { PublicNav } from "@/components/layout/public-nav";

export default function NotFound() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <PublicNav />
      <div className="lg:pl-56">
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center gap-4 px-8 text-center outline-none"
        >
          <h1 className="font-serif text-3xl tracking-tight text-foreground">
            This page is not available.
          </h1>
          <p className="text-sm text-muted-foreground">
            The link may be incorrect or may have been removed.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            >
              Go to homepage
            </Link>
            <Link
              href="/work"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            >
              Work
            </Link>
          </div>
        </main>
        <ContactBlock />
      </div>
    </>
  );
}
