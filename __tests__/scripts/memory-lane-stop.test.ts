import { describe, it, expect, vi } from 'vitest';

// Mock Node.js built-ins so memory-lane-stop.mjs can be imported in happy-dom environment
vi.mock('fs', () => ({
  default: { readFileSync: vi.fn(), writeFileSync: vi.fn() },
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));
vi.mock('child_process', () => ({
  default: { execSync: vi.fn().mockReturnValue('mock-branch') },
  execSync: vi.fn().mockReturnValue('mock-branch'),
}));
vi.mock('path', () => ({
  default: { join: vi.fn((...args: string[]) => args.join('/')) },
  join: vi.fn((...args: string[]) => args.join('/')),
}));

import { validateCreateEntitiesResponse, buildRetryMessage } from '../../scripts/memory-lane-stop.mjs';

describe('Docker response validation', () => {
  it('returns true when entities array is non-empty', () => {
    expect(validateCreateEntitiesResponse({ entities: [{ name: 'x' }] })).toBe(true);
  });

  it('returns true for content wrapper with entities', () => {
    expect(validateCreateEntitiesResponse({ content: [{ type: 'json', json: { entities: [{}] } }] })).toBe(true);
  });

  it('returns false for null response', () => {
    expect(validateCreateEntitiesResponse(null)).toBe(false);
  });

  it('returns false for empty entities array', () => {
    expect(validateCreateEntitiesResponse({ entities: [] })).toBe(false);
  });

  it('returns false for missing entities key', () => {
    expect(validateCreateEntitiesResponse({ ok: true })).toBe(false);
  });

  it('buildRetryMessage includes entity name', () => {
    const msg = buildRetryMessage('session-2026-04-29-001');
    expect(msg).toContain('session-2026-04-29-001');
    expect(msg).toContain('[memory:stop]');
  });
});
