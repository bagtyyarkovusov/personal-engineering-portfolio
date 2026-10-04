// Stable public demo token for the seeded `auto-tm-client-room` private room.
// Publishing the raw value is intentional: it grants read-only access to curated
// demo content. prisma/seed.ts upserts the SHA-256 hash of this value, so the
// link works on any environment that has been seeded.
export const PUBLIC_DEMO_ROOM_TOKEN =
  "decafbaddecafbaddecafbaddecafbaddecafbaddecafbaddecafbaddecafbad";

export const PUBLIC_DEMO_ROOM_PATH = `/rooms/${PUBLIC_DEMO_ROOM_TOKEN}`;
