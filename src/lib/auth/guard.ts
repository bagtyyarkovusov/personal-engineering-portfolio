import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const LOGIN_PATH = "/login";

/**
 * Server-side auth guard for admin routes and mutations.
 *
 * Calls `auth()` to check for an active session. If the user is not
 * authenticated, a redirect to the login page is triggered before any
 * admin data is rendered or processed.
 *
 * Must be called from a Server Component or Server Action before
 * executing privileged operations.
 *
 * @returns The session object when authenticated.
 * @throws (via Next.js `redirect()`) when no session exists.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect(LOGIN_PATH);
  }

  return session;
}
