import { describe, it, expect } from 'vitest';
import { countAddedLines, buildWarning } from '../../.claude/hooks/post-tool-use-guard.mjs';

describe('post-tool-use-guard', () => {
  it('counts added lines in a unified diff', () => {
    const diff = '+line1\n+line2\n+line3\n context\n-removed';
    expect(countAddedLines(diff)).toBe(3);
  });

  it('returns null warning when added lines <= 50', () => {
    expect(buildWarning('Edit', 10)).toBeNull();
  });

  it('returns warning string when added lines > 50', () => {
    const w = buildWarning('Edit', 51);
    expect(w).toContain('ORCHESTRATOR');
    expect(w).toContain('51');
  });

  it('returns null for non-file-modifying tools', () => {
    expect(buildWarning('Read', 999)).toBeNull();
  });

  it('returns null for Bash tool regardless of LOC', () => {
    expect(buildWarning('Bash', 999)).toBeNull();
  });
});
