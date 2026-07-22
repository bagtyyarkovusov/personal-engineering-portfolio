/**
 * Environment configuration validator.
 *
 * Pure validation logic. Import this directly in tests to avoid
 * triggering eager env evaluation.
 */

export type EnvConfig = Readonly<{
  databaseUrl: string
  nextAuthSecret: string
  nextAuthUrl: string
  githubClientId: string
  githubClientSecret: string
  authOwnerGithubId: string
}>

const REQUIRED_VARS = [
  { key: 'DATABASE_URL', envKeys: ['DATABASE_URL'] },
  { key: 'AUTH_SECRET', envKeys: ['AUTH_SECRET', 'NEXTAUTH_SECRET'] },
  { key: 'AUTH_URL', envKeys: ['AUTH_URL', 'NEXTAUTH_URL'] },
  { key: 'GITHUB_CLIENT_ID', envKeys: ['GITHUB_CLIENT_ID'] },
  { key: 'GITHUB_CLIENT_SECRET', envKeys: ['GITHUB_CLIENT_SECRET'] },
  { key: 'AUTH_OWNER_GITHUB_ID', envKeys: ['AUTH_OWNER_GITHUB_ID'] },
] as const

function readFirst(source: Record<string, string | undefined>, keys: readonly string[]) {
  return keys.map((key) => source[key]).find((value) => value && value.trim() !== "")
}

export function validateEnv(source: Record<string, string | undefined> = process.env): EnvConfig {
  const provided: string[] = [];

  for (const { key, envKeys } of REQUIRED_VARS) {
    if (!readFirst(source, envKeys)) {
      provided.push(key);
    }
  }

  // During Next.js build, allow missing env vars — the app will
  // validate them at runtime on first request.
  const isBuild =
    source.NEXT_PHASE === "phase-production-build" ||
    source.npm_lifecycle_event === "build";

  if (provided.length > 0 && !isBuild) {
    const list = provided.map((k) => `  - ${k}`).join("\n");
    throw new Error(
      `Missing required environment variable(s):\n${list}\n\n` +
        `Check your .env.local against .env.example and ensure all required variables are set.`
    );
  }

  return Object.freeze({
    databaseUrl: source.DATABASE_URL!,
    nextAuthSecret: readFirst(source, ["AUTH_SECRET", "NEXTAUTH_SECRET"])!,
    nextAuthUrl: readFirst(source, ["AUTH_URL", "NEXTAUTH_URL"])!,
    githubClientId: source.GITHUB_CLIENT_ID!,
    githubClientSecret: source.GITHUB_CLIENT_SECRET!,
    authOwnerGithubId: source.AUTH_OWNER_GITHUB_ID!,
  });
}
