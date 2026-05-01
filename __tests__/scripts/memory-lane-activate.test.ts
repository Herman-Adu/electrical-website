import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted ensures these are created before vi.mock factories run
const fsMocks = vi.hoisted(() => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  renameSync: vi.fn(),
}));

// Mock Node.js built-ins so memory-lane-activate.mjs can be imported in happy-dom environment
vi.mock('fs', () => ({
  default: fsMocks,
  ...fsMocks,
}));
vi.mock('child_process', () => ({
  default: { execSync: vi.fn().mockReturnValue('mock-branch') },
  execSync: vi.fn().mockReturnValue('mock-branch'),
}));
vi.mock('path', () => ({
  default: { join: vi.fn((...args: string[]) => args.join('/')) },
  join: vi.fn((...args: string[]) => args.join('/')),
}));

import { isAlreadyActive, writeJsonAtomic } from '../../scripts/memory-lane-activate.mjs';

describe('isAlreadyActive', () => {
  it('returns true when currentBranch matches config.branch', () => {
    expect(isAlreadyActive('main', { branch: 'main', entity: 'electrical-website-state' })).toBe(true);
  });

  it('returns false when branches differ', () => {
    expect(isAlreadyActive('main', { branch: 'feat/other', entity: 'feat-other' })).toBe(false);
  });

  it('returns false when config is null', () => {
    expect(isAlreadyActive('main', null)).toBe(false);
  });

  it('returns false when config has no branch', () => {
    expect(isAlreadyActive('main', { entity: 'electrical-website-state' })).toBe(false);
  });
});

describe('writeJsonAtomic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls writeFileSync with .tmp path then renameSync to target', () => {
    const data = { key: 'value' };
    writeJsonAtomic('/some/path/file.json', data);
    expect(fsMocks.writeFileSync).toHaveBeenCalledWith('/some/path/file.json.tmp', JSON.stringify(data, null, 2) + '\n', 'utf8');
    expect(fsMocks.renameSync).toHaveBeenCalledWith('/some/path/file.json.tmp', '/some/path/file.json');
  });

  it('does not throw when writeFileSync fails', () => {
    fsMocks.writeFileSync.mockImplementationOnce(() => { throw new Error('disk full'); });
    expect(() => writeJsonAtomic('/some/path/file.json', {})).not.toThrow();
  });
});
