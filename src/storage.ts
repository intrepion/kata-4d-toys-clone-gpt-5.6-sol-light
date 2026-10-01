import type { ToyState } from './physics';

export const EXPERIMENT_VERSION = 1;
export interface ExperimentFile { version: 1; sceneId: string; sliceW: number; toys: ToyState[]; savedAt: string; }
export interface Preferences { reducedMotion: boolean; highContrast: boolean; muted: boolean; introductionComplete: boolean; discoveries: string[]; }
export const defaultPreferences: Preferences = { reducedMotion: false, highContrast: false, muted: false, introductionComplete: false, discoveries: [] };

export function parseExperiment(raw: string): ExperimentFile {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw new Error('This is not an Elseplane Experiment File.');
  const candidate = value as Partial<ExperimentFile>;
  if (candidate.version !== EXPERIMENT_VERSION) throw new Error(`Experiment version ${String(candidate.version)} is not supported.`);
  if (typeof candidate.sceneId !== 'string' || typeof candidate.sliceW !== 'number' || !Array.isArray(candidate.toys)) throw new Error('The Experiment File is incomplete.');
  return candidate as ExperimentFile;
}

export function loadPreferences(): Preferences {
  try { return { ...defaultPreferences, ...JSON.parse(localStorage.getItem('elseplane:preferences') ?? '{}') }; }
  catch { return { ...defaultPreferences }; }
}
export const savePreferences = (preferences: Preferences): void => localStorage.setItem('elseplane:preferences', JSON.stringify(preferences));

