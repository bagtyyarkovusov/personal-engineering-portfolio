/**
 * Auth.js central module.
 *
 * Usage in server components:
 *   import { auth } from "@/lib/auth"
 *   const session = await auth()
 *
 * Usage in server actions / forms:
 *   import { signIn, signOut } from "@/lib/auth"
 *   await signIn("github")
 *   await signOut()
 *
 * Usage in admin layouts / route guards:
 *   import { requireAdmin } from "@/lib/auth"
 *   await requireAdmin()
 */

export { handlers, auth, signIn, signOut } from "./config"
export { requireAdmin } from "./guard"
