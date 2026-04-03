// Centralizes the level formula: Floor(XP / 100) + 1
// Single source of truth — previously duplicated 7 times across codebase
export const calcLevel = (xp) => Math.floor(xp / 100) + 1;
