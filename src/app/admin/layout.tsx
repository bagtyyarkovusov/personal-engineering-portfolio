import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/features/admin/admin-shell";

/**
 * Admin layout — server-side auth gate + sidebar shell.
 *
 * Every route under /admin runs through `requireAdmin()`, which
 * redirects unauthenticated users to /login before any admin UI
 * or data is loaded.  Authenticated sessions proceed to the
 * shadcn sidebar layout wrapped by `<AdminShell>`.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
