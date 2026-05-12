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
  { key: 'DATABASE_URL', envKey: 'DATABASE_URL' },
  { key: 'NEXTAUTH_SECRET', envKey: 'NEXTAUTH_SECRET' },
  { key: 'NEXTAUTH_URL', envKey: 'NEXTAUTH_URL' },
  { key: 'GITHUB_CLIENT_ID', envKey: 'GITHUB_CLIENT_ID' },
  { key: 'GITHUB_CLIENT_SECRET', envKey: 'GITHUB_CLIENT_SECRET' },
  { key: 'AUTH_OWNER_GITHUB_ID', envKey: 'AUTH_OWNER_GITHUB_ID' },
] as const

export function validateEnv(source: Record<string, string | undefined> = process.env): EnvConfig {
  const provided: string[] = [];

  for (const { envKey } of REQUIRED_VARS) {
    if (!source[envKey] || source[envKey].trim() === "") {
      provided.push(envKey);
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
    nextAuthSecret: source.NEXTAUTH_SECRET!,
    nextAuthUrl: source.NEXTAUTH_URL!,
    githubClientId: source.GITHUB_CLIENT_ID!,
    githubClientSecret: source.GITHUB_CLIENT_SECRET!,
    authOwnerGithubId: source.AUTH_OWNER_GITHUB_ID!,
  });
}
