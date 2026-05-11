import { requireAdmin } from "@/lib/auth";

/**
 * Admin layout — server-side auth gate.
 *
 * Every route under /admin runs through `requireAdmin()`, which
 * redirects unauthenticated users to /login before any admin UI
 * or data is loaded.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <>{children}</>;
}
