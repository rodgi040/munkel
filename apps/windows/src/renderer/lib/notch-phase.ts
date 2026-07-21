export type NotchPhase = 'full' | 'peek' | 'retracted';

export const NOTCH_FULL_MS = 5_000;
export const NOTCH_PEEK_MS = 30_000;
export const NOTCH_RETRACT_AT_MS = NOTCH_FULL_MS + NOTCH_PEEK_MS;
export const NOTCH_HISTORY_MS = 60_000;
