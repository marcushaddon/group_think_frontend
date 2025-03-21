import { Option } from "../../models";
import { sorter as makeSorter } from "./sort";

const mockOption = (id: string): Option<any> => ({
  id,
  name: id,
  description: id,
  uri: id,
  img: id,
});


describe("insertionSort generator", () => {
  it.skip("works", () => {
    const options: Option<any>[] = ["a", "b", "c", "d", "e", "f", "g"]
      .map(letter => mockOption(letter));
    
    const shuffled = [...options].sort(() => Math.random() > 0.5 ? -1 : 1);

    const sorter = makeSorter()(shuffled);

    let resultStr: string;
    let winner: string | undefined = undefined;
    let iterations
    while (true) {
      const res = sorter.next();
      if (res.done) {
        resultStr = res.value.map(o => o.id).join("");
        
        break;
      }
      expect(res.value.inserted).toBeDefined();
      expect(res.value.inserting).toBeDefined();

      winner = [res.value.inserted.id, res.value.inserting.id].sort()[0];
    }
    const sortedStr = options.map(o => o.id).join("");
    expect(resultStr).toEqual(sortedStr);
  });
});
