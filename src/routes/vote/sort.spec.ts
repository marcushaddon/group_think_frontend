import { Candidate } from "../../models";
import { sorter as makeSorter, Matchup } from "./sort";

const mockOption = (id: string): Candidate<any> => ({
  id,
  name: id,
  description: id,
  uri: id,
  img: id,
});

describe("insertionSort generator", () => {
  it.skip("works", () => {
    const options: Candidate<any>[] = ["a", "b", "c", "d", "e", "f", "g"].map(
      (letter) => mockOption(letter),
    );

    const shuffled = [...options].sort(() => (Math.random() > 0.5 ? -1 : 1));

    const sorter = makeSorter()(shuffled);

    let resultStr: string;
    while (true) {
      const res = sorter.next();
      if (res.done) {
        resultStr = res.value.map((o: Candidate<any>) => o.id).join("");

        break;
      }

      const matchupRes = res.value as Matchup<Candidate<any>>;
      expect(matchupRes.inserted).toBeDefined();
      expect(matchupRes.inserting).toBeDefined();
    }
    const sortedStr = options.map((o) => o.id).join("");
    expect(resultStr).toEqual(sortedStr);
  });
});
