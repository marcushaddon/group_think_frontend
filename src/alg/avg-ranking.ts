import { assert } from "../common/logging";
import { Result } from "./types";

export type AvgRankingResult = Result & { share: number };

export const avgRankings = (
  opts: string[],
  rankings: string[][],
): AvgRankingResult => {
  assert(
    rankings.length > 0,
    "Cannot choose highest avg ranking from empty list.",
  );
  const avgPlacements = opts.reduce(
    (map, current) => ({
      ...map,
      [current]: avgRanking(current, rankings, opts.length),
    }),
    {} as Record<string, number>,
  );

  const highest = Math.min(...Object.values(avgPlacements));

  const winners = opts.filter((opt) => avgPlacements[opt] === highest);

  return winners.length === 1
    ? {
        winner: winners[0],
        share: highest,
        tie: undefined,
      }
    : {
        tie: winners,
        share: highest,
        winner: undefined,
      };
};

const avgRanking = (
  opt: string,
  rankings: string[][],
  optCount: number,
): number => {
  const sum = rankings.reduce((total, current) => {
    const idx = current.indexOf(opt);

    return total + (idx > -1 ? idx : optCount);
  }, 0);

  return sum / optCount;
};
