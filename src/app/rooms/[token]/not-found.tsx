import Link from "next/link";

export default function RoomNotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-4 px-8 text-center">
      <p className="text-base text-muted-foreground">
        This page is not available.
      </p>
      <p className="text-sm text-muted-foreground">
        The link may be incorrect or may have been removed. Please contact the
        person who shared this link with you.
      </p>
      <Link
        href="/"
        className="mt-4 text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
      >
        Go to homepage
      </Link>
    </main>
  );
}
