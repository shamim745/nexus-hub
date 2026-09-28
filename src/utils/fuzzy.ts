const SCORE_CONSECUTIVE = 12;
const SCORE_WORD_START = 10;
const SCORE_BASE = 1;
const PENALTY_GAP = 1;

export interface FuzzyMatch {
  score: number;
  indexes: number[];
}

export function fuzzyMatch(query: string, target: string): FuzzyMatch | null {
  const needle = query.trim().toLowerCase();
  if (!needle) return { score: 0, indexes: [] };

  const haystack = target.toLowerCase();
  const indexes: number[] = [];
  let score = 0;
  let cursor = 0;
  let previousIndex = -1;

  for (const char of needle) {
    if (char === " ") continue;
    const found = haystack.indexOf(char, cursor);
    if (found === -1) return null;

    indexes.push(found);
    score += SCORE_BASE;

    if (previousIndex !== -1 && found === previousIndex + 1) {
      score += SCORE_CONSECUTIVE;
    } else if (found === 0 || /[\s\-_./@]/.test(haystack[found - 1] ?? "")) {
      score += SCORE_WORD_START;
    } else if (previousIndex !== -1) {
      score -= Math.min(found - previousIndex - 1, 5) * PENALTY_GAP;
    }

    previousIndex = found;
    cursor = found + 1;
  }

  if (haystack.startsWith(needle)) score += 20;
  return { score, indexes };
}

export function isFuzzyMatch(query: string, target: string): boolean {
  return fuzzyMatch(query, target) !== null;
}

export function sortFuzzy<T>(query: string, rows: readonly T[], pick: (row: T) => string): T[] {
  if (!query.trim()) return [...rows];
  return rows
    .map((row) => ({ row, match: fuzzyMatch(query, pick(row)) }))
    .filter((entry): entry is { row: T; match: FuzzyMatch } => entry.match !== null)
    .sort((a, b) => b.match.score - a.match.score)
    .map((entry) => entry.row);
}
