export type TestOpt = { id: string };

export const randInt = (min = 0, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

const randFloat = (min = 0, max: number) => min + Math.random() * (max - min);
randFloat(0, 1);

export const choose = <T>(opts: T[]) => {
  console.assert(
    opts.length > 0,
    "Cannot choose random element from empty list",
  );

  return opts[Math.floor(Math.random() * opts.length)];
};

export const shuffle = <T>(items: T[]) => [...items].sort(() => randInt(-1, 1));

export const shuffleWithFirst = (opts: TestOpt[], firstPlace: string) => {
  const first = opts.find(({ id }) => id === firstPlace)!;
  console.assert(
    !!first,
    `shuffleWithFirst: ${firstPlace} not found in provided options`,
  );

  const notFirst = opts.filter(({ id }) => id !== firstPlace);

  return [first, ...shuffle(notFirst)];
};

export const shuffleWithNotInFirst = (
  opts: TestOpt[],
  notFirstPlace: string,
) => {
  console.assert(
    !!opts.find(({ id }) => id === notFirstPlace),
    `shuffleWithNotFirstPlace: ${notFirstPlace} not found in provided options`,
  );

  const first = choose(opts.filter(({ id }) => id !== notFirstPlace));

  return shuffleWithFirst(opts, first.id);
};

export const options = (len = 10) =>
  [...Array(len)].map((_, i) => ({ id: String.fromCharCode(i + 49) }));

export const times = (n: number) => [...Array(n)].map((_, i) => i);
