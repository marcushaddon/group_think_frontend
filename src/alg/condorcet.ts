/**
 * https://en.wikipedia.org/wiki/Condorcet_method
 * OR:
 * use matrix method
 * convert each ballot into matrix (array in order of candidates, of arrays in order of candidates, with undefined in each rows index)
 * where matrix[i][j] = # of voters who prefer candidate i over candidate j
 * sum all matrices (counting undefined as 0)
 * row with n for all n - 1 spots (where n is number of voters) is condorcet winner
 */

export type Matrix = (number | undefined)[][];

export const rankingMatrix = (
  orderedCandidates: string[],
  ranking: string[],
): Matrix => {
  const idxMap = orderedCandidates.reduce(
    (map, candidate, idx) => ({
      ...map,
      [candidate]: idx,
    }),
    {} as Record<string, number>,
  );

  return orderedCandidates.map((runner) =>
    orderedCandidates.map((opponent) => {
      if (runner === opponent) {
        return undefined;
      }

      const [runnerRank, oppRank] = [runner, opponent].map((id) =>
        ranking.findIndex((candidateId) => candidateId === id),
      );

      return runnerRank < oppRank ? 1 : 0;
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

export const winner = (
  candidates: string[],
  summedMatrix: Matrix,
): {
  winner: string | undefined;
} => {
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
    };
  }

  return { winner: undefined };
};
