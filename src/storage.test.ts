import { describe, expect, it } from 'vitest';
import { parseExperiment } from './storage';

describe('Experiment Files', () => {
  it('accepts the current version', () => expect(parseExperiment(JSON.stringify({ version: 1, sceneId: 'workbench', sliceW: 0, toys: [], savedAt: '2026-10-01T00:00:00Z' })).sceneId).toBe('workbench'));
  it('rejects unknown future versions without mutation', () => expect(() => parseExperiment('{"version":2,"sceneId":"workbench","sliceW":0,"toys":[]}')).toThrow('not supported'));
  it('rejects incomplete data', () => expect(() => parseExperiment('{"version":1}')).toThrow('incomplete'));
});
