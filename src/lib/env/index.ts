import { validateEnv } from './validator'

export { validateEnv }
export type { EnvConfig } from './validator'

/**
 * Parsed and validated environment configuration.
 *
 * Evaluated at import time so the app fails fast on boot
 * if required variables are missing.
 */
export const env: import('./validator').EnvConfig = validateEnv()
