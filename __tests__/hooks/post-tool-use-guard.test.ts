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

  it('returns 0 for null input to countAddedLines', () => {
    expect(countAddedLines(null as unknown as string)).toBe(0);
  });

  it('returns 0 for empty string to countAddedLines', () => {
    expect(countAddedLines('')).toBe(0);
  });

  it('does not count +++ diff header lines', () => {
    const diff = '+++ b/file.tsx\n+real line\n+another line';
    expect(countAddedLines(diff)).toBe(2);
  });

  it('returns warning for Write tool with >50 lines', () => {
    expect(buildWarning('Write', 51)).toContain('ORCHESTRATOR');
  });

  it('returns warning for NotebookEdit tool with >50 lines', () => {
    expect(buildWarning('NotebookEdit', 51)).toContain('ORCHESTRATOR');
  });

  it('returns null for Write tool with <=50 lines', () => {
    expect(buildWarning('Write', 50)).toBeNull();
  });
});
