import { validateEnv } from "./validator";

export { validateEnv };
export type { EnvConfig } from "./validator";

/**
 * Parsed and validated environment configuration.
 *
 * Evaluated at import time. During Next.js build (NEXT_PHASE or
 * npm_lifecycle_event=build), missing vars are allowed — validation
 * is enforced at runtime.
 */
export const env: import("./validator").EnvConfig = validateEnv();
