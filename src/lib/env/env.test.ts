import { describe, it, expect } from 'vitest'
import { validateEnv } from './validator'

describe('validateEnv', () => {
  it('throws a readable error when required variables are missing', () => {
    const mockEnv = {
      DATABASE_URL: '',
      NEXTAUTH_SECRET: '',
      NEXTAUTH_URL: '',
      GITHUB_CLIENT_ID: '',
      GITHUB_CLIENT_SECRET: '',
      AUTH_OWNER_GITHUB_ID: '',
    }

    expect(() => validateEnv(mockEnv)).toThrow(
      /Missing required environment variable\(s\)/
    )
    expect(() => validateEnv(mockEnv)).toThrow(/DATABASE_URL/)
    expect(() => validateEnv(mockEnv)).toThrow(/NEXTAUTH_SECRET/)
    expect(() => validateEnv(mockEnv)).toThrow(
      /Check your \.env\.local against \.env\.example/
    )
  })

  it('throws when some variables are present but others are missing', () => {
    const mockEnv = {
      DATABASE_URL: 'postgresql://localhost/db',
      NEXTAUTH_SECRET: 'secret',
      NEXTAUTH_URL: 'http://localhost:3005',
      GITHUB_CLIENT_ID: '',
      GITHUB_CLIENT_SECRET: '',
      AUTH_OWNER_GITHUB_ID: '',
    }

    expect(() => validateEnv(mockEnv)).toThrow(/GITHUB_CLIENT_ID/)
    expect(() => validateEnv(mockEnv)).toThrow(/GITHUB_CLIENT_SECRET/)
  })

  it('throws when AUTH_OWNER_GITHUB_ID is missing', () => {
    const mockEnv = {
      DATABASE_URL: 'postgresql://localhost/db',
      NEXTAUTH_SECRET: 'super-secret',
      NEXTAUTH_URL: 'http://localhost:3005',
      GITHUB_CLIENT_ID: 'client-id',
      GITHUB_CLIENT_SECRET: 'client-secret',
      AUTH_OWNER_GITHUB_ID: '',
    }

    expect(() => validateEnv(mockEnv)).toThrow(/AUTH_OWNER_GITHUB_ID/)
  })

  it('returns a frozen config object when all required variables are set', () => {
    const mockEnv = {
      DATABASE_URL: 'postgresql://localhost/db',
      NEXTAUTH_SECRET: 'super-secret',
      NEXTAUTH_URL: 'http://localhost:3005',
      GITHUB_CLIENT_ID: 'client-id',
      GITHUB_CLIENT_SECRET: 'client-secret',
      AUTH_OWNER_GITHUB_ID: '1234567',
    }

    const config = validateEnv(mockEnv)

    expect(config.databaseUrl).toBe('postgresql://localhost/db')
    expect(config.nextAuthSecret).toBe('super-secret')
    expect(config.nextAuthUrl).toBe('http://localhost:3005')
    expect(config.githubClientId).toBe('client-id')
    expect(config.githubClientSecret).toBe('client-secret')
    expect(config.authOwnerGithubId).toBe('1234567')
    expect(Object.isFrozen(config)).toBe(true)
  })
})
