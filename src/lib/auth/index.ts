import { auth, signIn, signOut } from "./auth";
import { requireAdmin } from "./guard";

// Re-export auth helpers for use in layouts, pages, and actions.
export { auth, signIn, signOut, requireAdmin };
