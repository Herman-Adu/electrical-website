import { describe, it, expect, vi } from 'vitest';

// Mock Node.js built-ins so memory-lane-activate.mjs can be imported in happy-dom environment
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

import { isAlreadyActive } from '../../scripts/memory-lane-activate.mjs';

describe('isAlreadyActive', () => {
  it('returns true when currentBranch matches activeLanes.currentBranch', () => {
    expect(isAlreadyActive('main', { currentBranch: 'main', status: 'active' })).toBe(true);
  });

  it('returns false when branches differ', () => {
    expect(isAlreadyActive('main', { currentBranch: 'feat/other', status: 'active' })).toBe(false);
  });

  it('returns false when activeLanes is null', () => {
    expect(isAlreadyActive('main', null)).toBe(false);
  });

  it('returns false when activeLanes has no currentBranch', () => {
    expect(isAlreadyActive('main', { status: 'active' })).toBe(false);
  });
});
