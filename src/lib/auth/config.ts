/**
 * Auth.js configuration for owner-only GitHub OAuth.
 *
 * - Only the GitHub account whose numeric user ID matches
 *   `AUTH_OWNER_GITHUB_ID` is allowed to sign in.
 * - No client accounts or email/password auth in v1.
 */

import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

/**
 * Parse the owner GitHub ID from the environment.
 * Returns `null` when unset (e.g. during build / SSR without env).
 */
function getOwnerGitHubId(): number | null {
  const raw = process.env.AUTH_OWNER_GITHUB_ID
  if (!raw || raw.trim() === "") return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      // Allowlist: only the owner GitHub account may sign in.
      // The signIn callback checks the GitHub profile.id against
      // AUTH_OWNER_GITHUB_ID. No other accounts are permitted.
    }),
  ],

  callbacks: {
    signIn({ profile }) {
      const ownerId = getOwnerGitHubId()

      // If no owner ID is configured, deny all sign-ins.
      // This prevents accidental open sign-in.
      if (ownerId === null) {
        return false
      }

      // The GitHub provider supplies the numeric user ID as profile.id.
      if (profile?.id !== undefined) {
        const profileId = Number(profile.id)
        return Number.isFinite(profileId) && profileId === ownerId
      }

      return false
    },
  },

  pages: {
    signIn: "/login",
  },

  trustHost: process.env.NODE_ENV !== "production",

  // JWT strategy (no database session in v1)
  session: {
    strategy: "jwt",
  },
}
