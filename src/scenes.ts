import type { ToyState } from './physics';

export interface SceneDefinition { id: string; name: string; prompt: string; discovery: string; gravity: number; toys: ToyState[]; }
const toy = (id: string, kind: ToyState['kind'], color: number, position: ToyState['position'], size = 1.4): ToyState => ({ id, kind, color, position, size, velocity: [0, 0, 0, 0], rotation: [0, 0, 0] });

export const scenes: SceneDefinition[] = [
  { id: 'paper-window', name: 'Paper Window', prompt: 'A flat window meets a solid world.', discovery: 'Move the slice until every form vanishes, then bring it back.', gravity: 0, toys: [toy('flat-sphere', 'hypersphere', 0xe49764, [-1.5, 0, 0, 0], 1.5), toy('flat-cube', 'tesseract', 0x568a80, [1.4, 0, 0, .5], 2)] },
  { id: 'first-crossing', name: 'First Crossing', prompt: 'What disappears is still there.', discovery: 'Cross both toys along W.', gravity: -5.8, toys: [toy('amber-cube', 'tesseract', 0xe78357, [-1.7, .1, 0, 0], 2.2), toy('violet-sphere', 'hypersphere', 0x7560a9, [1.8, .2, .2, .35], 1.35)] },
  { id: 'tilted-space', name: 'Tilted Space', prompt: 'Rotate the slice, not the camera.', discovery: 'Use two different 4D rotation planes.', gravity: 0, toys: [toy('five-cell', 'simplex', 0xe6a548, [-1.7, 0, 0, 0], 2.1), toy('sixteen-cell', 'orthoplex', 0x4f8da5, [1.7, 0, 0, 0], 1.6)] },
  { id: 'beyond-ramp', name: 'Beyond the Ramp', prompt: 'Momentum continues where sight cannot.', discovery: 'Throw a sphere until it leaves and re-enters the slice.', gravity: -7, toys: [toy('rolling-one', 'hypersphere', 0xdf6a58, [-2.4, 1.7, 0, -.5], 1), toy('rolling-two', 'hypersphere', 0xe1ad50, [0, 2.4, 0, .65], .8), toy('rolling-three', 'hypersphere', 0x5d8c83, [2.2, 3, 0, 1.2], .65)] },
  { id: 'smaller-opening', name: 'The Smaller Opening', prompt: 'A narrow view is not a narrow world.', discovery: 'Rotate the tesseract into its smallest cross-section.', gravity: 0, toys: [toy('aperture-cube', 'tesseract', 0xc56b50, [0, 0, 0, 0], 2.8)] },
  { id: 'unlinked', name: 'Unlinked', prompt: 'Two rings share space—until they do not.', discovery: 'Separate the rings along W.', gravity: 0, toys: [toy('coral-ring', 'hypertorus', 0xd76f63, [-.45, 0, 0, -.18], 2.2), toy('blue-ring', 'hypertorus', 0x527f9d, [.45, 0, 0, .18], 2.2)] },
  { id: 'weightless-garden', name: 'Weightless Garden', prompt: 'Let impossible forms drift.', discovery: 'See every Toy Family in a single slice.', gravity: 1.2, toys: [toy('garden-duo', 'duocylinder', 0x7a63a8, [-2, -.5, 0, 0], 1.8), toy('garden-cell', 'orthoplex', 0x55a37e, [0, 0, 0, .25], 1.4), toy('garden-simplex', 'simplex', 0xe6a64d, [2, .4, 0, -.2], 1.8)] },
  { id: 'workbench', name: 'The Workbench', prompt: 'Make an experiment of your own.', discovery: 'Place four different Toy Families together.', gravity: -5.8, toys: [toy('bench-cube', 'tesseract', 0xe78357, [0, 0, 0, 0], 1.8)] },
];
