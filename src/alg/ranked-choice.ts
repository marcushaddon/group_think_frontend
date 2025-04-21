import * as logger from "../common/logging";
import { isSubsetOf } from "../common/util";
import { Result } from "./types";
type Option = { id: string };

export type RoundEvent = {
  name: "Round";
  options: string[];
};

export type FirstPlaceSharesEvent = {
  name: "FirstPlaceShares";
  shares: Record<string, number>;
};

export type MajorityEvent = {
  name: "Majority";
  winner: { id: string; share: number };
};

export type TieEvent = {
  name: "Tie";
  winners: string[];
  share: number;
};

export type LoserChosenEvent = {
  name: "LoserChosen";
  loser: string;
};

export type ElectionEvent =
  | RoundEvent
  | FirstPlaceSharesEvent
  | MajorityEvent
  | TieEvent
  | LoserChosenEvent;

export type RCEResult = Result & {
  logs: ElectionEvent[];
};

export const rcv = <T extends Option>(
  rankings: T[][],
  logs: ElectionEvent[] = [],
): RCEResult => {
  let workingRankings = [...rankings];
  const runoffLogs: ElectionEvent[] = logs.concat([
    {
      name: "Round",
      options: optionsFromRankings(rankings),
    },
  ]);
  // TODO: if we have a tie
  const scores = firstPlaceShares(workingRankings);

  runoffLogs.push({
    name: "FirstPlaceShares",
    shares: scores,
  });

  // 1st shares = shares(rankings)
  const results = superlatives(scores);

  // this is wrong in the case that
  const weHaveATie =
    results.winners &&
    results.winners.reduce((acc, [, count]) => acc + count, 0) ===
      workingRankings.length;

  if (weHaveATie) {
    const winners = results.winners.map(([id]) => id);
    const share = results.winners[0][1] / rankings.length;

    return {
      tie: winners,
      winner: undefined,
      logs: [
        ...runoffLogs,
        {
          name: "Tie",
          winners,
          share,
        },
      ],
    };
  }

  // winner = shares where s > 0.5
  const winner = results.winner;
  const share = winner ? winner[1] / workingRankings.length : 0;

  // if winner return winner
  if (winner && share > 0.5) {
    return {
      winner: results.winner[0],
      tie: undefined,
      logs: runoffLogs.concat([
        {
          name: "Majority",
          winner: {
            id: results.winner[0],
            share: results.winner[1] / rankings.length,
          },
        },
      ]),
    };
  }
  // loser = find loser
  // rankings = filter(loser)

  workingRankings = workingRankings.map((ranking) =>
    ranking.filter((opt) => opt.id !== results.loser[0]),
  );

  return rcv(
    workingRankings,
    logs.concat([
      {
        name: "LoserChosen",
        loser: results.loser[0],
      },
    ]),
  );
};

const firstPlaceShares = (rs: Option[][]): Record<string, number> =>
  rs
    .filter((r) => r.length > 0)
    .reduce(
      (counts, current) => ({
        ...counts,
        [current[0].id]: (counts[current[0].id] || 0) + 1,
      }),
      {} as Record<string, number>,
    );

type Highest =
  | {
      winner: [string, number];
      winners: undefined;
    }
  | {
      winner: undefined;
      winners: [string, number][];
    };
type Lowest = {
  loser: [string, number];
};

type Superlatives = Highest & Lowest;

// vsWinner
const vsWinner = (
  [highId, highScore]: [string, number],
  [vsId, vsScore]: [string, number],
): Highest =>
  vsScore > highScore
    ? { winner: [vsId, vsScore], winners: undefined }
    : vsScore < highScore
      ? { winner: [highId, highScore], winners: undefined }
      : {
          winners: [
            [highId, highScore],
            [vsId, vsScore],
          ],
          winner: undefined,
        };
// vsWinners
const vsWinners = (
  winners: [string, number][],
  [vsId, vsScore]: [string, number],
): Highest =>
  winners.every(([, score]) => vsScore < score)
    ? { winners, winner: undefined }
    : winners.every(([, score]) => vsScore === score)
      ? {
          winners: [...winners, [vsId, vsScore]],
          winner: undefined,
        }
      : { winner: [vsId, vsScore], winners: undefined };

const winner = (sups: Superlatives, contender: [string, number]) =>
  sups.winner
    ? vsWinner(sups.winner, contender)
    : vsWinners(sups.winners, contender);

const loser = (
  [lowId, lowScore]: [string, number],
  [vId, vScore]: [string, number],
): Lowest =>
  vScore < lowScore ? { loser: [vId, vScore] } : { loser: [lowId, lowScore] };

const superlatives = (shares: Record<string, number>) =>
  Object.entries(shares).reduce(
    (res, [current, score]) => ({
      ...winner(res, [current, score]),
      ...loser(res.loser, [current, score]),
    }),
    { winner: ["", -Infinity], loser: ["", Infinity] } as Superlatives,
  );

const optionsFromRankings = (rankings: Option[][]): string[] => {
  const opts = new Set(rankings[0].map(({ id }) => id));
  const valid =
    rankings.length > 0 &&
    rankings.every((r) => {
      const set = new Set(r.map(({ id }) => id));

      return isSubsetOf(set, opts) && isSubsetOf(set, opts);
    });

  logger.assert(valid, "Invalid rankings", { rankings });

  return [...opts.values()];
};
