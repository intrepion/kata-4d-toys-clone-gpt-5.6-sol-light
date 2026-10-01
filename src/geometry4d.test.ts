import { describe, expect, it } from 'vitest';
import { rotate4D, sliceShape } from './geometry4d';

describe('4D geometry', () => {
  it('rotates between x and w without changing length', () => {
    const rotated = rotate4D([1, 2, 3, 0], [Math.PI / 2, 0, 0]);
    expect(rotated[0]).toBeCloseTo(0);
    expect(rotated[3]).toBeCloseTo(1);
    expect(rotated.reduce((sum, value) => sum + value ** 2, 0)).toBeCloseTo(14);
  });

  it('slices a centered tesseract into eight cube vertices', () => {
    expect(sliceShape('tesseract', 2, [0, 0, 0], 0).points).toHaveLength(8);
  });

  it('removes a tesseract beyond its W extent', () => {
    expect(sliceShape('tesseract', 2, [0, 0, 0], 1.01).points).toHaveLength(0);
  });

  it('uses the analytic hypersphere cross-section', () => {
    expect(sliceShape('hypersphere', 2, [0, 0, 0], 1.2).radius).toBeCloseTo(1.6);
    expect(sliceShape('hypersphere', 2, [0, 0, 0], 2.1).radius).toBeUndefined();
  });

  it.each(['simplex', 'orthoplex'] as const)('creates a central slice for %s', (kind) => {
    expect(sliceShape(kind, 2, [0.2, -0.1, 0.3], 0).points.length).toBeGreaterThanOrEqual(4);
  });

  it('slices a duocylinder into a cylinder with shrinking depth', () => {
    const center = sliceShape('duocylinder', 2, [0, 0, 0], 0);
    const offset = sliceShape('duocylinder', 2, [0, 0, 0], 1);
    expect(center.radius).toBeCloseTo(1.24);
    expect(center.depth).toBeGreaterThan(offset.depth!);
  });

  it('slices a hypertorus by shrinking its tube', () => {
    expect(sliceShape('hypertorus', 2, [0, 0, 0], 0).depth).toBeCloseTo(0.48);
    expect(sliceShape('hypertorus', 2, [0, 0, 0], 0.5).depth).toBeUndefined();
  });
});
