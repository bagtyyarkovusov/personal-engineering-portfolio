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

import NextAuth from "next-auth"
import { authConfig } from "./config"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export { requireAdmin } from "./guard"
