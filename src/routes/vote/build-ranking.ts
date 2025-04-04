import { ChoiceMap } from ".";
import { MatchupResult, MatchupAward } from "../../models";
import { Choice, PendingRanking, Poll } from "../../models";

export const optionAwardKey = (optId: string, award: MatchupAward) =>
  `${optId}-${award}`;

export const buildRanking = <T extends { id: string }>(
  sortedOptions: T[],
  matchups: MatchupResult[],
  poll: Poll,
): PendingRanking => {
  const choices: Choice[] = sortedOptions.map((opt) => ({
    optionId: opt.id,
  }));

  return {
    pollId: poll.id,
    choices,
    matchups,
  };
};
