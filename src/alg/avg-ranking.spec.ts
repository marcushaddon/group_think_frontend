import { avgRankings } from "./avg-ranking";
import { choose, options, randInt, shuffleWithFirst, times } from "./utils";

describe("avgRanking", () => {
  it.each(times(30))("decides landslide", () => {
    const opts = options(randInt(2, 20));

    const winner = choose(opts);

    const rankings = times(randInt(2, 10)).map(() =>
      shuffleWithFirst(opts, winner.id),
    );

    const res = avgRankings(
      opts.map(({ id }) => id),
      rankings.map((r) => r.map(({ id }) => id)),
    );

    expect(res.winner).toEqual(winner.id);
  });
});
