import { describe, it, expect } from 'vitest';
import type {
  FullMatrixCellImpl,
  FullMatrixCell,
  FullMatrixRow,
  FullMatrix,
} from './data.models';

describe('FullMatrix types', () => {
  it('should allow constructing a FullMatrixCell', () => {
    const cell: FullMatrixCell = {
      harnessId: 'claude-code',
      harnessName: 'Claude Code',
      harnessIcon: 'claude-code.svg',
      supportedCount: 3,
      totalCount: 5,
      implementations: [],
    };
    expect(cell.supportedCount).toBe(3);
  });

  it('should allow constructing a FullMatrixRow', () => {
    const row: FullMatrixRow = {
      feature: {
        id: 'tools',
        name: 'Tools',
        description: 'desc',
        category: 'capabilities',
        sortOrder: 2,
      },
      totalImplementations: 5,
      cells: [],
    };
    expect(row.totalImplementations).toBe(5);
  });

  it('should allow constructing a FullMatrix', () => {
    const matrix: FullMatrix = {
      harnesses: [],
      rows: [],
    };
    expect(matrix.rows).toEqual([]);
  });
});
