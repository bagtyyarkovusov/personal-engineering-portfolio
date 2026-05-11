import { requireAdmin } from "./guard";

// Re-export the admin guard for use in layouts, pages, and actions.
export { requireAdmin };

/**
 * Stub auth function — replaced by the real auth module (Task A).
 *
 * The concurrent Task A will wire Auth.js with GitHub OAuth
 * and return a real session object from this function.
 *
 * Until then, this stub returns null so unauthenticated routes
 * redirect as expected during development.
 */
export async function auth(): Promise<{ user: { email: string; name: string; image: string | null } } | null> {
  return null;
}

/**
 * Stub signIn — replaced by the real auth module (Task A).
 */
export async function signIn(): Promise<unknown> {
  return null;
}

/**
 * Stub signOut — replaced by the real auth module (Task A).
 */
export async function signOut(): Promise<void> {
  /* no-op */
}
