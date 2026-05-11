/**
 * Auth.js API route handler.
 *
 * Handles all /api/auth/* endpoints (sign in, sign out, session, etc.).
 * Re-exports the GET and POST handlers from the central auth config.
 */

import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
