import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "./config";

const LOGIN_PATH = "/login";

/**
 * Server-side auth guard for admin routes and mutations.
 *
 * Calls `auth()` to check for an active session. If the user is not
 * authenticated, a redirect to /login is triggered with the current
 * path as callbackUrl so the user returns here after sign-in.
 *
 * Must be called from a Server Component or Server Action before
 * executing privileged operations.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    const heads = await headers();
    const path = heads.get("x-invoke-path") || "/admin";
    redirect(`${LOGIN_PATH}?callbackUrl=${encodeURIComponent(path)}`);
  }

  return session;
}
