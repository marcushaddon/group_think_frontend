import { rcv } from "./ranked-choice";
import {
  choose,
  options,
  randInt,
  shuffle,
  shuffleWithFirst,
  shuffleWithNotInFirst,
  times,
} from "./utils";

it.each(times(20))("chooses outright majority", () => {
  const opts = options(randInt(2, 20));

  const winner = choose(opts);
  console.log("Test chooses winner", winner);

  const voters = randInt(2, 10);

  const majority = randInt(
    Math.ceil(voters / 2) + (voters % 2 === 0 ? 1 : 0),
    voters,
  );

  const rankings = [...Array(voters)].map((_, i) =>
    i <= majority
      ? shuffleWithFirst(opts, winner.id)
      : shuffleWithNotInFirst(opts, winner.id),
  );
  console.log(
    "test: first places",
    rankings.map((r) => r[0]),
  );
  const shuffledRankings = shuffle(rankings);

  const res = rcv(shuffledRankings);
  console.log("test got:", res);

  expect(res.winner).toBe(winner.id);
  console.log("test is done");
});

it.todo("finds winner after 1 runoff");
