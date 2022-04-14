import { Option } from "../../models";
import { insertionSort } from "./sort";

const mockOption = (id: string): Option => ({
  id,
  name: "option",
  description: "option",
  uri: "option",
  img: "option",
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
      console.log("TEST: next comparison", res);
      if (res.done) {
        resultStr = res.value.map(o => o.id).join("");
        
        break;
      }
      expect(res.value.choiceA).toBeDefined();
      expect(res.value.choiceB).toBeDefined();

      winner = [res.value.choiceA.id, res.value.choiceB.id].sort()[0];
      console.log("winner", winner);
    }
    const sortedStr = options.map(o => o.id).join("");
    expect(resultStr).toEqual(sortedStr);
  });
});
