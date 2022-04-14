import { assert } from "console";
import { Option } from "../../models";

export type SearchStepResult = {
  choiceA: Option;
  choiceB: Option;
}

export type SortStepResult = SearchStepResult & {
  progress: number;
}

function* binarySearch(options: Option[], option: Option): Generator<SearchStepResult, number, string | undefined> {
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

  console.assert(l === r); // Hmm, not actually sure this is true?

  const finalRes = yield { choiceA: options[l], choiceB: option };

  return finalRes === option.id ? l + 1 : l;
}

export function* insertionSort(unsorted: Option[]): Generator<SortStepResult, Option[], string | undefined> {
  const debuggingMatchups: { [key: string]: boolean } = {};

  const unsortedCopy = [...unsorted];
  const sorted: Option[] = [];
  while (unsortedCopy.length > 0) {
    const next = unsortedCopy.pop()!;
    let winner: string | undefined;
    const bin = binarySearch(sorted, next);

    while (true) {
      const res = bin.next(winner);
      if (res.done) {
        sorted.splice(res.value, 0, next);
        break;
      }

      const debugKey = [res.value.choiceA.id, res.value.choiceB.id].sort().join("_");
      console.assert(!(debugKey in debuggingMatchups), "SORTER: duplicate matchup!", {
        debugKey, debuggingMatchups
      });
      debuggingMatchups[debugKey] = true;

      winner = yield { ...res.value, progress: sorted.length };
    }   
  }

  return sorted;
}
