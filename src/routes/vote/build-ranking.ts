import { ChoiceMap, OptionAward } from ".";
import { Choice, PendingRanking, Poll } from "../../models";

export const optionAwardKey = (optId: string, award: OptionAward) =>
  `${optId}-${award}`;

export const buildRanking = <T extends { id: string }>(
  sortedOptions: T[],
  awardMap: ChoiceMap,
  poll: Poll,
): PendingRanking => {
  const choices = sortedOptions.map((opt) =>
    Object.values(OptionAward).reduce(
      (choice, awardName) => ({
        ...choice,
        choiceTypes: {
          ...choice.choiceTypes,
          [awardName]:
            awardMap[optionAwardKey(opt.id, awardName as OptionAward)] || 0,
        },
      }),
      { optionId: opt.id, choiceTypes: {} },
    ),
  ) as Choice[];

  return {
    pollId: poll.id,
    choices,
  };
};
