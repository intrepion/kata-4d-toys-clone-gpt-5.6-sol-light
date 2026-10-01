import { describe, expect, it } from 'vitest';
import { isRecoverable, stepToy, type ToyState } from './physics';

const toy: ToyState = { id: 'test', kind: 'tesseract', size: 1, color: 0xffffff, position: [0, 2, 0, 0], velocity: [1, 0, 0, 0], rotation: [0, 0, 0] };
describe('bounded physics', () => {
  it('integrates gravity and horizontal motion', () => { const next = stepToy(toy, 0.5); expect(next.position[0]).toBeCloseTo(0.5); expect(next.velocity[1]).toBeLessThan(0); });
  it('bounces at the floor', () => { const falling = { ...toy, position: [0, -3, 0, 0] as ToyState['position'], velocity: [0, -2, 0, 0] as ToyState['velocity'] }; expect(stepToy(falling, 1 / 60).velocity[1]).toBeGreaterThan(0); });
  it('marks toys near the recovery boundary', () => expect(isRecoverable({ ...toy, position: [0, 0, 0, 5.9] })).toBe(true));
});

