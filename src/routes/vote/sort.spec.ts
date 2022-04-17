import { Option } from "../../models";
import { insertIdx, insertionSort } from "./sort";

const mockOption = (id: string): Option => ({
  id,
  name: id,
  description: id,
  uri: id,
  img: id,
});

const driveInsertIdx = (gen: ReturnType<typeof insertIdx>): number => {
  let winnerId: string | undefined = undefined;
  while (true) {
    const res = gen.next(winnerId);
    if (res.done) {
      return res.value
    }
    const { choiceA, choiceB } = res.value;
    winnerId = [choiceA.id, choiceB.id].sort()[1];
  }
}

describe("insertIdx", () => {
  it("works", () => {
    const opts = ["a", "b", "c", "d", "e", "f", "g"]
      .map(letter => mockOption(letter));

    for (let i = 0; i < opts.length; i++) {
      const withTargetRemoved = [...opts];
      const target = withTargetRemoved.splice(i, 1);

      const gen = insertIdx(target[0], withTargetRemoved);
      const res = driveInsertIdx(gen);

      expect(res).toEqual(i);
    }
  })
})

describe("insertionSort generator", () => {
  it("works", () => {
    const options: Option[] = ["a", "b", "c", "d", "e", "f", "g"]
      .map(letter => mockOption(letter));
    
    const shuffled = [...options].sort(() => Math.random() > 0.5 ? -1 : 1);

    const sorter = insertionSort(shuffled);

    let resultStr: string;
    let winner: string | undefined = undefined;
    while (true) {
      const res = sorter.next(winner);
      if (res.done) {
        resultStr = res.value.map(o => o.id).join("");
        
        break;
      }
      expect(res.value.choiceA).toBeDefined();
      expect(res.value.choiceB).toBeDefined();

      winner = [res.value.choiceA.id, res.value.choiceB.id].sort()[1];
    }
    const sortedStr = options.map(o => o.id).join("");
    expect(resultStr).toEqual(sortedStr);
  });
});
