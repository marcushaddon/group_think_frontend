import { rcv } from "./ranked-choice";

type TestOpt = { id: string };

const randInt = (min = 0, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

const randFloat = (min = 0, max: number) => min + Math.random() * (max - min);
randFloat(0, 1);

const choose = <T>(opts: T[]) => {
  console.assert(
    opts.length > 0,
    "Cannot choose random element from empty list",
  );

  return opts[Math.floor(Math.random() * opts.length)];
};

const shuffle = <T>(items: T[]) => [...items].sort(() => randInt(-1, 1));

const shuffleWithFirst = (opts: TestOpt[], firstPlace: string) => {
  const first = opts.find(({ id }) => id === firstPlace)!;
  console.assert(
    !!first,
    `shuffleWithFirst: ${firstPlace} not found in provided options`,
  );

  const notFirst = opts.filter(({ id }) => id !== firstPlace);

  return [first, ...shuffle(notFirst)];
};

const shuffleWithNotInFirst = (opts: TestOpt[], notFirstPlace: string) => {
  console.assert(
    !!opts.find(({ id }) => id === notFirstPlace),
    `shuffleWithNotFirstPlace: ${notFirstPlace} not found in provided options`,
  );

  const first = choose(opts.filter(({ id }) => id !== notFirstPlace));

  return shuffleWithFirst(opts, first.id);
};

const options = (len = 10) =>
  [...Array(len)].map((_, i) => ({ id: String.fromCharCode(i + 49) }));

const times = (n: number) => [...Array(n)].map((_, i) => i);

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

  expect(typeof res).toBe("string");
  expect(res).toBe(winner.id);
  console.log("test is done");
});

it.todo("finds winner after 1 runoff");
