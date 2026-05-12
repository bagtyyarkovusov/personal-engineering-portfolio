/**
 * Owner sign-in page.
 *
 * Unauthenticated users land here when they try to access admin-protected
 * routes. The page offers a single "Sign in with GitHub" button that
 * triggers the Auth.js GitHub OAuth flow.
 *
 * The signIn action is a Server Action so no client JS is required for
 * the redirect — the form posts to the Auth.js API route directly.
 * This means the page works even when JavaScript is disabled.
 */

import { signIn } from "@/lib/auth"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export const metadata = {
  title: "Sign in — Bagtyyar",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const session = await auth()

  // If already signed in, redirect to the callbackUrl or admin
  if (session?.user) {
    const { callbackUrl } = await searchParams
    redirect(callbackUrl || "/admin")
  }

  const { error, callbackUrl } = await searchParams

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-6 py-16">
      <article className="space-y-8">
        {/* Heading */}
        <header className="space-y-2">
          <h1 className="font-serif text-3xl tracking-tight text-foreground">
            Owner sign in
          </h1>
          <p className="text-sm text-muted-foreground">
            This area is restricted to the site owner. Sign in with GitHub to
            continue.
          </p>
        </header>

        {/* Sign-in form */}
        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: callbackUrl || "/admin" })
          }}
        >
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <GitHubIcon />
            Sign in with GitHub
          </button>
        </form>

        {/* Auth error message */}
        {error && (
          <p className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error === "AccessDenied"
              ? "Access denied. Only the site owner may sign in."
              : "An error occurred during sign in. Please try again."}
          </p>
        )}
      </article>
    </main>
  )
}

/** Inline GitHub logo so the page has zero JS client dependencies. */
function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
