import { ChoiceMap, OptionAward } from ".";
import { Poll } from "../../client/groupthink";
import { Choice, Option, PendingRanking } from "../../models";

export const optionAwardKey = (optId: string, award: OptionAward) => `${optId}-${award}`;

export const buildRanking = (sortedOptions: Option[], awardMap: ChoiceMap, poll: Poll): PendingRanking => {
  const choices = sortedOptions.map(
    opt => Object.values(OptionAward)
      .reduce((choice, awardName) => ({
        ...choice,
        [awardName]: awardMap[optionAwardKey(opt.id, awardName as OptionAward)] || 0,
      }), { optionId: opt.id })
  ) as Choice[];

  return {
    pollId: poll.id,
    choices,
  };
}
