import { Option } from "../../models";

type StepResult = {
  choiceA: Option;
  choiceB: Option;
}

function* binarySearch(options: Option[], option: Option): Generator<StepResult, number, string | undefined> {
  let l = 0;
  let r = options.length;

  if (r === 0) { return 0 };

  while (l < r) {
    const mid = Math.floor((l + r) / 2);
    const winner = yield { choiceA: options[mid], choiceB: option };

    if (winner === undefined) {
      return mid;
    }

    if (winner === option.id) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }

  console.assert(l === r);

  const finalRes = yield { choiceA: options[l], choiceB: option };

  return finalRes === option.id ? l + 1 : l;
}

function* insertionSort(unsorted: Option[]): Generator<StepResult, Option[], string | undefined> {
  const sorted: Option[] = [];
  while (unsorted.length > 0) {
    const next = unsorted.pop()!;
    console.log("next to be inserted", next);
    let winner: string | undefined;
    const bin = binarySearch(sorted, next);
    while (true) {
      var res = bin.next(winner);
      if (res.done) {
        console.log("place for next found", res.value);
        sorted.splice(res.value, 0, next);
        break;
      }
      console.log("'next' matchup for next", res.value);
      winner = yield res.value;
    }   
  }

  return sorted;
}
