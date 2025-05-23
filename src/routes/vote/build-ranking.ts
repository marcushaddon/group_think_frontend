import { MatchupResult, MatchupAward } from "../../models";
import { Choice, PendingRanking, Election } from "../../models";

export const optionAwardKey = (optId: string, award: MatchupAward) =>
  `${optId}-${award}`;

export const buildRanking = <T extends { id: string }>(
  sortedOptions: T[],
  matchups: MatchupResult[],
  poll: Election,
): PendingRanking => {
  const choices: Choice[] = sortedOptions.map((opt) => ({
    candidateId: opt.id,
  }));

  return {
    pollId: poll.id,
    choices,
    matchups,
  };
};
