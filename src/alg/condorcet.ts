/**
 * https://en.wikipedia.org/wiki/Condorcet_method
 *
 * TODO: detect cycles?
 * TODO: fallback methods
 * TODO: test partial rankings?
 */

import { Candidate, Ranking } from "../models";
import { Result } from "./types";

export type Matrix = (number | undefined)[][];

export type CondorcetResult = Result & { matrix: Matrix };

export const rankingMatrix = (
  orderedCandidates: string[],
  ranking: string[],
): Matrix => {
  return orderedCandidates.map((runner) =>
    orderedCandidates.map((opponent) => {
      if (runner === opponent) {
        return undefined;
      }

      const [runnerRank, oppRank] = [runner, opponent].map((id) =>
        ranking.findIndex((candidateId) => candidateId === id),
      );

      return runnerRank > -1 && runnerRank < oppRank ? 1 : 0;
    }),
  );
};

const emptyMatrix = (count: number) =>
  [...Array(count)].map((_, i) =>
    [...Array(count)].map((_, j) => (i === j ? undefined : 0)),
  );

export const addMatrices = (matrices: Matrix[]): Matrix =>
  matrices.reduce(
    (summed, current) =>
      summed.map((row, i) =>
        row.map((count, j) =>
          i === j ? undefined : (count || 0) + (current[i][j] || 0),
        ),
      ),
    emptyMatrix(matrices[0].length),
  );

export const condorcetInner = (
  candidates: string[],
  summedMatrix: Matrix,
): Result => {
  const scores = summedMatrix.map((row) =>
    row.reduce(
      (total: number, contest) => ((total || 0) + (contest || 0)) as number,
      0 as number,
    ),
  );

  const highScore = Math.max(...scores);
  const winners = scores
    .map((score, idx) => (score === highScore ? idx : -1))
    .filter((idx) => idx > -1);

  if (winners.length === 1) {
    return {
      winner: candidates[winners[0]],
      tie: undefined,
    };
  }

  return {
    winner: undefined,
    tie: winners.map((w) => candidates[w]),
  };
};

export const condorcet = (
  candidates: Candidate<unknown>[],
  rankings: Ranking[],
): CondorcetResult => {
  const candidateIds = candidates.map(({ id }) => id);
  const idRankings = rankings.map((r) =>
    r.choices.map(({ candidateId }) => candidateId),
  );

  const matrices = idRankings.map((idRanking) =>
    rankingMatrix(candidateIds, idRanking),
  );

  const summed = addMatrices(matrices);

  return {
    ...condorcetInner(candidateIds, summed),
    matrix: summed,
  };
};
