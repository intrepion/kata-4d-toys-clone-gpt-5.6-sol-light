import type { Rotation4, ShapeKind, Vec4 } from './geometry4d';

export interface ToyState { id: string; kind: ShapeKind; size: number; color: number; position: Vec4; velocity: Vec4; rotation: Rotation4; }
export const FIXED_STEP = 1 / 60;

export function stepToy(toy: ToyState, seconds: number, gravity = -5.8): ToyState {
  const velocity: Vec4 = [...toy.velocity];
  velocity[1] += gravity * seconds;
  const position = toy.position.map((value, axis) => value + velocity[axis] * seconds) as Vec4;
  const floor = -2.35 + toy.size * 0.45;
  if (position[1] < floor) { position[1] = floor; velocity[1] = Math.abs(velocity[1]) > 0.12 ? -velocity[1] * 0.48 : 0; velocity[0] *= 0.985; velocity[2] *= 0.985; }
  for (const axis of [0, 2, 3] as const) if (Math.abs(position[axis]) > 6) { position[axis] = Math.sign(position[axis]) * 6; velocity[axis] *= -0.55; }
  return { ...toy, position, velocity };
}

export const isRecoverable = (toy: ToyState): boolean => toy.position.some((value) => Math.abs(value) > 5.8);

