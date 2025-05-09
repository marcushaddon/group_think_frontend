import { rankingMatrix, addMatrices, condorcetInner } from "./condorcet";

describe("Ranking Matrix", () => {
  const candidates = ["a", "b", "c", "d"];
  const ranking1 = ["b", "c", "a", "d"];
  const ranking2 = ["d", "a", "c", "b"];
  const ranking3 = ["a", "c", "b", "d"];

  const _ = undefined;

  it("single matrix matches wikipedia", () => {
    const matrix = rankingMatrix(candidates, ranking1);

    expect(matrix).toEqual([
      [_, 0, 0, 1],
      [1, _, 1, 1],
      [1, 0, _, 1],
      [0, 0, 0, _],
    ]);
  });

  it("wikipedia integration test", () => {
    const matrices = [ranking1, ranking2, ranking3].map((r) =>
      rankingMatrix(candidates, r),
    );

    const summed = addMatrices(matrices);

    expect(summed).toEqual([
      [_, 2, 2, 2],
      [1, _, 1, 2],
      [1, 2, _, 2],
      [1, 1, 1, _],
    ]);

    expect(condorcetInner(candidates, summed).winner).toEqual("a");
  });

  it("detects tie", () => {
    const summed = [
      [_, 2, 1, 2],
      [1, _, 1, 2],
      [1, 2, _, 2],
      [1, 1, 1, _],
    ];

    expect(condorcetInner(candidates, summed).tie).toEqual(["a", "c"]);
  });

  it("tolerates partial rankings", () => {
    const filtered = [
      ranking1.filter((c) => c !== "b"),
      ranking2,
      ranking3.filter((c) => c !== "b" && c !== "d"),
    ];

    console.log(filtered);

    const matrices = filtered.map((ranking) =>
      rankingMatrix(candidates, ranking),
    );

    const summed = addMatrices(matrices);

    const res = condorcetInner(candidates, summed);
    console.log(summed);
  });
});
