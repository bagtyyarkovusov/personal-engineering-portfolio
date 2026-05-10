import { ContentStatus, ContentVisibility } from "@prisma/client";

/**
 * A publication surface where content can appear.
 *
 * - `public`: the public-facing portfolio site
 * - `privateRoom`: a read-only client project room accessed via signed link
 * - `admin`: the owner-only admin dashboard
 */
export type ContentSurface = "public" | "privateRoom" | "admin";

/**
 * Input required to evaluate publication policy.
 */
export interface ContentPolicyInput {
  status: ContentStatus;
  visibility: ContentVisibility;
}

/**
 * Determine whether content with the given status and visibility
 * should be visible on the requested surface.
 *
 * Rules:
 * - Admin sees everything.
 * - Draft and archived content are never visible outside admin.
 * - Public surface sees only published + public.
 * - PrivateRoom surface sees only published + privateRoom.
 * - adminOnly visibility is never visible outside admin.
 */
export function isVisibleOn(
  surface: ContentSurface,
  input: ContentPolicyInput
): boolean {
  if (surface === "admin") {
    return true;
  }

  if (input.status !== ContentStatus.published) {
    return false;
  }

  if (surface === "public") {
    return input.visibility === ContentVisibility.public;
  }

  if (surface === "privateRoom") {
    return input.visibility === ContentVisibility.privateRoom;
  }

  return false;
}

/**
 * Build a Prisma `where` filter for a given surface.
 *
 * Returns an object that can be spread into a Prisma query's `where` clause.
 * For the admin surface, returns an empty object (no filtering).
 */
export function buildVisibilityFilter(surface: ContentSurface) {
  if (surface === "admin") {
    return {};
  }

  return {
    status: ContentStatus.published,
    visibility:
      surface === "public"
        ? ContentVisibility.public
        : ContentVisibility.privateRoom,
  };
}
