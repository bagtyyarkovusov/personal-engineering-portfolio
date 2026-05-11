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
 */

import NextAuth from "next-auth"
import { authConfig } from "./config"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
