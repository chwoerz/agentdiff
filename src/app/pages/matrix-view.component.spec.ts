import { DataService } from '../services/data.service';
import { FullMatrix } from '../models/data.models';

describe('MatrixViewComponent data', () => {
  it('should produce a matrix with correct structure for rendering', () => {
    const service = new DataService(null as any);
    service.loadData({
      features: [
        { id: 'f1', name: 'Feature 1', description: 'desc1', category: 'cat', sortOrder: 1 },
      ],
      implementations: [
        { id: 'impl1', name: 'Impl 1', featureId: 'f1', description: '', example: '', syntax: '', docUrl: '', userExtensible: false },
      ],
      harnesses: [
        {
          id: 'h1', name: 'Harness 1', icon: 'h1.svg', website: '', platforms: [{ id: 'cli', name: 'CLI' }],
          implementations: [
            { implementation: { id: 'impl1', name: 'Impl 1', featureId: 'f1', description: '', example: '', syntax: '', docUrl: '', userExtensible: false }, platforms: ['cli'], notes: '' },
          ],
        },
      ],
    });

    const matrix: FullMatrix = service.getFullMatrix();
    expect(matrix.harnesses).toHaveLength(1);
    expect(matrix.rows).toHaveLength(1);
    expect(matrix.rows[0].feature.name).toBe('Feature 1');
    expect(matrix.rows[0].cells[0].supportedCount).toBe(1);
    expect(matrix.rows[0].cells[0].totalCount).toBe(1);
  });
});
